import { useSelectControl } from "../hooks/useSelectControl";
import { useEffect, useState } from "react";
import { cursorModeEnum, eventNameEnum, svgTypeEnum } from "../utils/enums";
import { sideBarWidth } from "./SideBar";
import { useLineGenerator } from "../hooks/useLineGenerator";
import { MousePoint } from "./MousePoint";
import { usePathGenerator } from "../hooks/usePathGenerator";
import { useSvgStore } from "../hooks/useSvgStore";
import { ThrottlingDebouncingManager } from "../eventTarget/ThrottlingDebouncingManager";
import { render } from "../utils/canvasTools";
import { useStarsGenerator } from "../hooks/useStarsGenerator";
import { useSaveControl } from "../hooks/useSaveControl";
import { SvgIdAndMutablePropsManager } from "../eventTarget/SvgIdAndMutablePropsManager";
import { bannerHeight } from "./Banner";
import { WindowManager } from "../eventTarget/WindowManager";
import { SelectBox } from "./SelectBox";
import { useClipImageGenerator } from "../hooks/useClipImageGenerator";

export const Canvas = ({ currentEvent, setCurrentEvent, owner }) => {
  const {
    addSvgOnStore,
    hideSvgOnStore,
    setAdditionalProps,
    liveStore,
    store,
    onWindowChange,
    load,
    // cleanUpStore,
  } = useSvgStore();
  const { handleSelect, setDiffPosOnAll, onDrag, onDrop, handleSelectBox } =
    // useSelectControl(cleanUpStore);
    useSelectControl();
  const {
    initClientSelectBoxSize,
    setClientSelectBoxSize,
    finClientSelectBoxSize,
    selectBoxSize,
  } = handleSelectBox;
  const generateNextId =
    SvgIdAndMutablePropsManager.getInstance().generateNextId;

  const [tempPos, setTempPos] = useState(new Map());
  const [cursorMode, setCursorMode] = useState(cursorModeEnum.default);
  const [canvasSize, setCanvasSize] = useState({
    // width: window.innerWidth - sideBarWidth,
    // height: window.innerHeight - bannerHeight,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const TM = ThrottlingDebouncingManager.getInstance();
  const WM = WindowManager.getInstance();
  const SIMP = SvgIdAndMutablePropsManager.getInstance();

  const { addPoint, quit } = useLineGenerator(
    addSvgOnStore,
    setCurrentEvent,
    setTempPos,
  );

  const { addStar } = useStarsGenerator(
    addSvgOnStore,
    setCurrentEvent,
    setTempPos,
  );

  const { setClipboardImgSrc } = useClipImageGenerator(
    addSvgOnStore,
    setCurrentEvent,
  );

  const { addPointOnSet, setIsDrawing } = usePathGenerator(addSvgOnStore);

  const { saveCurrentWindow, getWindows } = useSaveControl();

  const deleteSvgById = (id) => hideSvgOnStore(id, false);

  const onScroll = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (TM.getEventThrottling(TM.scrollEvent)) return;

    TM.setEventMap(TM.scrollEvent, true);

    setTimeout(() => {
      const canvasX = canvasSize.width;
      const hiddenX = window.scrollX;
      const clientX = window.innerWidth;

      const canvasY = canvasSize.height;
      const hiddenY = window.scrollY;
      const clientY = window.innerHeight;

      setCanvasSize((prev) => {
        const windowSize = {
          width:
            canvasX - (hiddenX + clientX) <= 50 ? canvasX + 100 : prev.width,
          height:
            canvasY - (hiddenY + clientY) <= 50 ? canvasY + 100 : prev.height,
        };

        WM.setWindowSize(windowSize);

        return windowSize;
      });

      TM.setEventMap(TM.scrollEvent, false);
    }, 150);
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [canvasSize]);

  const onMouseDown = (e) => {
    if (cursorMode === cursorModeEnum.write) {
      setIsDrawing(true);
      return;
    }

    const id = e.target.parentNode?.parentNode?.id;

    if (currentEvent === eventNameEnum.none && id && id === "root") {
      const fixPos = {
        x: e.clientX - sideBarWidth + window.scrollX,
        y: e.clientY + window.scrollY - bannerHeight,
      };

      if (initClientSelectBoxSize(fixPos)) {
        setCurrentEvent(eventNameEnum.multiSelect);
        return;
      }
    }

    setDiffPosOnAll({
      x: e.clientX + window.scrollX,
      y: e.clientY + window.scrollY - bannerHeight,
    });
  };

  const onMouseMove = (e) => {
    e.preventDefault();

    if (cursorMode === cursorModeEnum.write) {
      const fixPos = {
        x: e.clientX - sideBarWidth + window.scrollX,
        y: e.clientY + window.scrollY - bannerHeight,
      };
      addPointOnSet(fixPos);
      return;
    }

    if (currentEvent === eventNameEnum.multiSelect) {
      const fixPos = {
        x: e.clientX - sideBarWidth + window.scrollX,
        y: e.clientY + window.scrollY - bannerHeight,
      };
      setClientSelectBoxSize(fixPos);
      return;
    }

    if (cursorMode === cursorModeEnum.erase) {
      const isLeftButtonClicked = e.buttons === 1;

      if (isLeftButtonClicked) {
        const id = e.target.parentNode?.parentNode?.id;

        if (id && id !== "root") {
          deleteSvgById(id);
          SIMP.setIdUpdateFlagMap(id);
        }
      }
      return;
    }

    const TM = ThrottlingDebouncingManager.getInstance();

    if (TM.getEventThrottling(TM.dragEvent)) {
      return;
    }

    TM.setEventMap(TM.dragEvent, true);

    if (currentEvent === eventNameEnum.none) {
      const calcPos = {
        x: e.clientX + window.scrollX,
        y: e.clientY + window.scrollY - bannerHeight,
      };
      onDrag(calcPos);
    }

    setTimeout(() => {
      TM.setEventMap(TM.dragEvent, false);
    }, 10);
  };

  const onMouseUp = (e) => {
    if (cursorMode === cursorModeEnum.write) {
      setIsDrawing(false);
      return;
    }

    if (currentEvent === eventNameEnum.multiSelect) {
      finClientSelectBoxSize(liveStore);

      setCurrentEvent(eventNameEnum.none);
      return;
    }

    const fixPos = {
      x: e.clientX - sideBarWidth + window.scrollX,
      y: e.clientY + window.scrollY - bannerHeight,
    };

    if (currentEvent === eventNameEnum.addRect) {
      const key = generateNextId(svgTypeEnum.rect);
      const attachment = {
        src: {
          x: fixPos.x - 75,
          y: fixPos.y - 75,
        },
        width: 150,
        height: 150,
      };

      addSvgOnStore(key, attachment);
      setCurrentEvent(eventNameEnum.none);
      return;
    }

    if (currentEvent === eventNameEnum.addText) {
      const key = generateNextId(svgTypeEnum.text);
      const attachment = {
        src: {
          x: fixPos.x - 100,
          y: fixPos.y - 40,
        },
        width: 200,
        height: 80,
      };

      addSvgOnStore(key, attachment);
      setCurrentEvent(eventNameEnum.none);
      return;
    }

    if (currentEvent === eventNameEnum.addImage) {
      setClipboardImgSrc(fixPos);
      return;
    }

    if (currentEvent === eventNameEnum.addLine) {
      setTempPos((prev) => new Map(prev).set(fixPos.x, fixPos));
      addPoint(fixPos);
      return;
    }

    if (currentEvent === eventNameEnum.addStars) {
      setTempPos((prev) => new Map(prev).set(fixPos.x, fixPos));
      addStar(fixPos);
      return;
    }

    if (!e.ctrlKey) {
      onDrop(fixPos);
    }
  };

  useEffect(() => {
    console.log("use effect", currentEvent, cursorMode);

    if (currentEvent === eventNameEnum.addPath) {
      setCursorMode(cursorModeEnum.write);
      return;
    }

    if (currentEvent === eventNameEnum.erase) {
      setCursorMode(cursorModeEnum.erase);
      return;
    }

    if (currentEvent === eventNameEnum.windowChange) {
      onWindowChange();
      setCurrentEvent(eventNameEnum.none);
    }

    if (currentEvent === eventNameEnum.save) {
      // saveCurrent(owner, liveStore);
      console.log("store???", store);
      saveCurrentWindow(owner, store);

      setCurrentEvent(eventNameEnum.none);
    }

    if (currentEvent === eventNameEnum.load) {
      getWindows(owner, load);
      setCurrentEvent(eventNameEnum.none);
    }

    setCursorMode(cursorModeEnum.default);
  }, [currentEvent]);

  const onTouchStart = (e) => {
    if (cursorMode === cursorModeEnum.write) {
      setIsDrawing(true);
    }
  };

  const onTouchMove = (e) => {
    if (cursorMode === cursorModeEnum.write) {
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      const fixPos = {
        x: clientX - sideBarWidth + window.scrollX,
        y: clientY + window.scrollY - bannerHeight,
      };
      addPointOnSet(fixPos);
    }
  };

  const onTouchEnd = (e) => {
    if (cursorMode === cursorModeEnum.write) {
      setIsDrawing(false);
    }
  };

  return (
    <div
      id="canvas"
      style={{
        position: "relative",
        backgroundColor: "white",
        width: canvasSize.width,
        height: canvasSize.height,
        marginLeft: sideBarWidth,
        marginTop: bannerHeight,
        scrollBehavior: "smooth",
        border: "none",
        cursor:
          currentEvent === eventNameEnum.write
            ? "crosshair"
            : currentEvent === eventNameEnum.erase
              ? "wait"
              : currentEvent === eventNameEnum.none
                ? "default"
                : "pointer",
        touchAction: "none",
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {selectBoxSize.src.x !== selectBoxSize.dest.x && (
        <SelectBox selectClientBox={selectBoxSize} />
      )}
      {Array.from(tempPos).map((value) => (
        <MousePoint src={value[1]} key={value[0]} />
      ))}
      {render(liveStore, handleSelect, deleteSvgById, setAdditionalProps)}
    </div>
  );
};
