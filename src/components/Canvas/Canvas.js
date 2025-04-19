import { useSelectControl } from "../../hooks/useSelectControl";
import {forwardRef, useCallback, useEffect, useRef, useState} from "react";
import { cursorModeEnum, eventNameEnum, svgTypeEnum } from "../../utils/enums";
import { sideBarWidth } from "../Sidebar/SideBar";
import { useLineGenerator } from "../../hooks/useLineGenerator";
import { MousePoint } from "../MousePoint";
import { usePathGenerator } from "../../hooks/usePathGenerator";
import { useSvgStore } from "../../hooks/useSvgStore";
import { ThrottlingDebouncingManager } from "../../eventTarget/ThrottlingDebouncingManager";
import { render } from "../../utils/canvasTools";
import { useStarsGenerator } from "../../hooks/useStarsGenerator";
import { useSaveControl } from "../../hooks/useSaveControl";
import { SvgIdAndMutablePropsManager } from "../../eventTarget/SvgIdAndMutablePropsManager";
import { bannerHeight } from "../Tabs";
import { WindowManager } from "../../eventTarget/WindowManager";
import { SelectBox } from "../SelectBox";
import { useClipImageGenerator } from "../../hooks/useClipImageGenerator";
import { ToastMessage } from "../ToastMessage";
import { MessageQueue } from "../../utils/MessageQueue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./canvas.module.css"


const TM = ThrottlingDebouncingManager.getInstance();
const WM = WindowManager.getInstance();
const SIMP = SvgIdAndMutablePropsManager.getInstance();
const MD = MessageQueue.getInstance();

export const Canvas = forwardRef(({ currentEvent, setCurrentEvent, owner, canvasSize, setCanvasSize }, ref) => {
  const {
    addSvgOnStore,
    hideSvgOnStore,
    setAdditionalProps,
    liveStore,
    store,
    onWindowChange,
    load,
  } = useSvgStore();
  const { handleSelect, setDiffPosOnAll, onDrag, onDrop, handleSelectBox } =
      useSelectControl(setCurrentEvent);
  const {
    initClientSelectBoxSize,
    setClientSelectBoxSize,
    finClientSelectBoxSize,
    selectBoxSize,
  } = handleSelectBox;
  const generateNextId =
      SvgIdAndMutablePropsManager.getInstance().generateNextId;

  const [messages, setMessages] = useState([]);
  const [tempPos, setTempPos] = useState(new Map());
  const [cursorMode, setCursorMode] = useState(cursorModeEnum.default);

  const canvasWrapRef = useRef(null);
  const lastScroll = useRef({ top: 0, left: 0 });

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

  const showToastMessage = (message) => {
    MD.push(message);
    const test = MD.getCurrentQueue();
    setMessages(test);

    setTimeout(() => {
      const result = MD.popLeft();
      const test2 = MD.getCurrentQueue();
      // console.log("test2", test2);
      setMessages(test2);
    }, 1600);
  };

  const onScroll = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (TM.getEventThrottling(TM.scrollEvent)) return;

    TM.setEventMap(TM.scrollEvent, true);

    setTimeout(() => {
      const scrollX = canvasWrapRef.current.scrollLeft;
      const scrollY = canvasWrapRef.current.scrollTop;

      const xScrollDividen = Math.round(scrollX / 100)
      const yScrollDividen = Math.round(scrollY / 30)
      const isVertical = xScrollDividen !== lastScroll.current.left;
      const isHorizontal = yScrollDividen !== lastScroll.current.top;

      setCanvasSize((prev) => {
        const windowSize = {
          width: isVertical && xScrollDividen >= lastScroll.current.left  ? prev.width + 100 : prev.width,
          height: isHorizontal && yScrollDividen >= lastScroll.current.top ? prev.height + 100 : prev.height,
        };

        // const el = ref.currrent;
        // if (el) {
        //   el.style.setProperty('--width', windowSize.width);
        //   el.style.setProperty('--height', windowSize.height)
        // }

        lastScroll.current = {
          left: Math.max(xScrollDividen, lastScroll.current.left),
          top: Math.max(yScrollDividen, lastScroll.current.top)
        }

        WM.setWindowSize(windowSize);

        return windowSize;
      });

      TM.setEventMap(TM.scrollEvent, false);
    }, 150);
  };

  useEffect(() => {
    canvasWrapRef.current.addEventListener("scroll", onScroll);

    return () => {
      canvasWrapRef.current.removeEventListener("scroll", onScroll);
    };
  }, [canvasSize]);

  const onMouseDown = useCallback((e) => {
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
  }, [cursorMode, setIsDrawing, initClientSelectBoxSize, setCurrentEvent, setDiffPosOnAll]);

  const onMouseMove = useCallback((e) => {
    e.preventDefault();

    if (cursorMode === cursorModeEnum.write) {
      const cleanUpTimer = TM.getDebounceTimer(TM.writeCleanUpEvent);

      if (cleanUpTimer) {
        clearTimeout(cleanUpTimer);
      }

      const cleanUp = setTimeout(() => {
        setIsDrawing(false);
      }, 500);

      TM.setDebounceTimer(TM.writeCleanUpEvent, cleanUp);

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
  }, [currentEvent, cursorMode, addPointOnSet, setClientSelectBoxSize, deleteSvgById, setClientSelectBoxSize, deleteSvgById, onDrag]);

  const onMouseUp = useCallback((e) => {
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
  }, [cursorMode, currentEvent, setCurrentEvent, setIsDrawing, finClientSelectBoxSize, generateNextId, addSvgOnStore, setClipboardImgSrc, setTempPos, addPoint, addStar, onDrop]);

  useEffect(() => {
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
      saveCurrentWindow(owner, store);
      showToastMessage("saved");
      setCurrentEvent(eventNameEnum.none);
    }

    if (currentEvent === eventNameEnum.load) {
      // getWindows(owner, load);
      // const savedStr = localStorage.getItem('saved');
      // console.log(savedStr)
      // load(JSON.parse(savedStr));
      showToastMessage("hi there :)");
      setCurrentEvent(eventNameEnum.none);
    }

    setCursorMode(cursorModeEnum.default);
  }, [currentEvent]);

  return (
      <div ref={canvasWrapRef} className={styles.canvasWrap}>
        <div
            id="canvas"
            className={`${styles.canvas} ${
                currentEvent === eventNameEnum.write
                    ? styles.cursorCrosshair
                    : currentEvent === eventNameEnum.erase
                        ? styles.cursorWait
                        : currentEvent === eventNameEnum.none
                            ? styles.cursorDefault
                            : styles.cursorPointer
            }`}
            ref={ref}
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
            }}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            // onTouchStart={onTouchStart}
            // onTouchMove={onTouchMove}
            // onTouchEnd={onTouchEnd}
        >
          {selectBoxSize.src.x !== selectBoxSize.dest.x && (
              <SelectBox selectClientBox={selectBoxSize} />
          )}
          {messages.map((value, index) => (
              <ToastMessage key={index} message={value} />
          ))}
          {Array.from(tempPos).map((value) => (
              <MousePoint src={value[1]} key={value[0]} />
          ))}
          {render(liveStore, handleSelect, deleteSvgById, setAdditionalProps)}
        </div>
      </div>
  );
});
