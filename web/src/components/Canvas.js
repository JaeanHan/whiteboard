import { useSelectManager } from "../hooks/useSelectManager";
import { useEffect, useState } from "react";
import { cursorModeEnum, eventNameEnum, svgTypeEnum } from "../utils/enums";
import { useSvgIdGenerator } from "../hooks/useSvgIdGenerator";
import { toolBarWidth } from "./ToolBar";
import { useLineGenerator } from "../hooks/useLineGenerator";
import { MousePoint } from "./MousePoint";
import { usePathGenerator } from "../hooks/usePathGenerator";
import { SelectBox } from "./SelectBox";
import { useSvgStore } from "../hooks/useSvgStore";
import { ThrottleManager } from "../eventTarget/ThrottleManager";
import { render } from "../utils/canvasTools";
import { useStarsGenerator } from "../hooks/useStarsGenerator";
import { useSaveManager } from "../hooks/useSaveManager";

const owner = "jaean";

export const Canvas = ({ currentEvent, setCurrentEvent }) => {
  const {
    addSvgOnStore,
    updateSvgOnStore,
    setAdditionalProps,
    liveStore,
    load,
  } = useSvgStore();
  const {
    handleSelect,
    setDiffPosOnAll,
    onDrag,
    onDrop,
    selectBoxSize,
    handleSelectBox,
  } = useSelectManager();
  const {
    initClientSelectBoxSize,
    setClientSelectBoxSize,
    finClientSelectBoxSize,
  } = handleSelectBox;
  const { generateNextId } = useSvgIdGenerator();

  const [tempPos, setTempPos] = useState(new Map());
  const [cursorMode, setCursorMode] = useState(cursorModeEnum.default);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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

  const { addPointOnSet, setIsDrawing } = usePathGenerator(addSvgOnStore);

  const { save, read } = useSaveManager();

  const onScroll = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const TM = ThrottleManager.getInstance();

    if (TM.getEventThrottling(TM.scrollEvent)) {
      return;
    }

    TM.setEventMap(TM.scrollEvent, true);

    setTimeout(() => {
      const canvasX = canvasSize.width;
      const hiddenX = window.scrollX;
      const clientX = window.innerWidth;

      const canvasY = canvasSize.height;
      const hiddenY = window.scrollY;
      const clientY = window.innerHeight;

      setCanvasSize((prev) => {
        return {
          width:
            canvasX - (hiddenX + clientX) <= 50 ? canvasX + 100 : prev.width,
          height:
            canvasY - (hiddenY + clientY) <= 50 ? canvasY + 100 : prev.height,
        };
      });

      TM.setEventMap(TM.scrollEvent, false);
    }, 500);
  };

  const onMouseDown = (e) => {
    if (cursorMode === cursorModeEnum.write) {
      setIsDrawing(true);
      return;
    }

    const id = e.target.parentNode?.parentNode?.id;

    if (currentEvent === eventNameEnum.none && id && id === "root") {
      const fixPos = {
        x: e.clientX - toolBarWidth + window.scrollX,
        y: e.clientY + window.scrollY,
      };

      if (initClientSelectBoxSize(fixPos)) {
        setCurrentEvent(eventNameEnum.multiSelect);
        return;
      }
    }

    setDiffPosOnAll({
      x: e.clientX + window.scrollX,
      y: e.clientY + window.scrollY,
    });
  };

  const onMouseMove = (e) => {
    e.preventDefault();

    if (cursorMode === cursorModeEnum.write) {
      const fixPos = {
        x: e.clientX - toolBarWidth + window.scrollX,
        y: e.clientY + window.scrollY,
      };
      addPointOnSet(fixPos);
      return;
    }

    if (currentEvent === eventNameEnum.multiSelect) {
      const fixPos = {
        x: e.clientX - toolBarWidth + window.scrollX,
        y: e.clientY + window.scrollY,
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
        }
      }
      return;
    }

    const TM = ThrottleManager.getInstance();

    if (TM.getEventThrottling(TM.dragEvent)) {
      return;
    }

    TM.setEventMap(TM.dragEvent, true);

    if (currentEvent === eventNameEnum.none) {
      // const id = e.target.parentNode?.parentNode?.id;
      const calcPos = {
        x: e.clientX + window.scrollX,
        y: e.clientY + window.scrollY,
      };
      // console.log("id", id);
      // if (!id.startsWith(svgTypeEnum.stars)) {
      onDrag(calcPos);
      // } else {
      //   console.log("lll");
      // }
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
      x: e.clientX - toolBarWidth + window.scrollX,
      y: e.clientY + window.scrollY,
    };

    if (currentEvent === eventNameEnum.addRect) {
      const key = svgTypeEnum.rect + generateNextId();
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
      const key = svgTypeEnum.text + generateNextId();
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
    }

    if (currentEvent === eventNameEnum.addLine) {
      setTempPos((prev) => new Map(prev).set(fixPos.x, fixPos));
      addPoint(fixPos);
      return;
    }

    if (currentEvent === eventNameEnum.addStars) {
      setTempPos((prev) => new Map(prev).set(fixPos.x, fixPos));
      addStar(fixPos);
    }

    if (!e.ctrlKey) {
      onDrop();
    }
  };

  const deleteSvgById = (id) => {
    updateSvgOnStore(id, false);
  };

  useEffect(() => {
    console.log("use effect", currentEvent);

    if (currentEvent === eventNameEnum.addPath) {
      setCursorMode(cursorModeEnum.write);
      return;
    }

    if (currentEvent === eventNameEnum.erase) {
      setCursorMode(cursorModeEnum.erase);
      return;
    }

    if (currentEvent === eventNameEnum.save) {
      save(owner, liveStore);
      setCurrentEvent(eventNameEnum.none);
    }

    if (currentEvent === eventNameEnum.read) {
      read(owner, load);
      setCurrentEvent(eventNameEnum.none);
    }

    setCursorMode(cursorModeEnum.default);
  }, [currentEvent]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [canvasSize]);

  return (
    <div
      id="canvas"
      style={{
        position: "relative",
        backgroundColor: "white",
        width: canvasSize.width,
        height: canvasSize.height,
        marginLeft: toolBarWidth,
        scrollBehavior: "smooth",
        cursor:
          currentEvent === eventNameEnum.write
            ? "crosshair"
            : currentEvent === eventNameEnum.erase
              ? "wait"
              : currentEvent === eventNameEnum.none
                ? "default"
                : "pointer",
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      // onTouchStart={onMouseDown}
      // onTouchMove={onMouseMove}
      // onTouchEnd={onMouseUp}
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
