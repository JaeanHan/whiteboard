import { useSelectManager } from "../hooks/useSelectManager";
import { RectSVG } from "./RectSVG";
import { TextSVG } from "./TextSVG";
import { useEffect, useRef, useState } from "react";
import { SimpleLineSVG } from "./SimpleLineSVG";
import { cursorModeEnum, eventNameEnum, svgTypeEnum } from "../utils/enums";
import { useSvgIdGenerator } from "../hooks/useSvgIdGenerator";
import { toolBarWidth } from "./ToolBar";
import { useLineGenerator } from "../hooks/useLineGenerator";
import { MousePoint } from "./MousePoint";
import { usePathGenerator } from "../hooks/usePathGenerator";
import { PathSVG } from "./PathSVG";
import { SelectBox } from "./SelectBox";
import { useSvgStore } from "../hooks/useSvgStore";
import { ThrottleManager } from "../eventTarget/ThrottleManager";

export const Canvas = ({ currentEvent, setCurrentEvent }) => {
  const { addSvgOnStore, updateSvgOnStore, setAdditionalProps, liveStore } =
    useSvgStore();
  const {
    handleSelect,
    setDiffPosOnAll,
    onDrag,
    onDrop,
    selectBoxSize,
    initClientSelectBoxSize,
    setClientSelectBoxSize,
    finClientSelectBoxSize,
  } = useSelectManager();
  const { generateNextId } = useSvgIdGenerator();

  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const canvasRef = useRef();
  const [tempPos, setTempPos] = useState(new Map());
  const [cursorMode, setCursorMode] = useState(cursorModeEnum.default);

  const { addPoint, quit } = useLineGenerator(
    addSvgOnStore,
    setCurrentEvent,
    setTempPos,
  );

  const { addPointOnSet, setIsDrawing } = usePathGenerator(addSvgOnStore);

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
      const calcPos = {
        x: e.clientX + window.scrollX,
        y: e.clientY + window.scrollY,
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

    setCursorMode(cursorModeEnum.default);
  }, [currentEvent]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [canvasSize, setCanvasSize]);

  const onScroll = (e) => {
    e.preventDefault();
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
    }, 150);
  };

  return (
    <div
      id="canvas"
      ref={canvasRef}
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
      onScroll={(e) => console.log(e)}
    >
      {selectBoxSize.src.x !== selectBoxSize.dest.x && (
        <SelectBox selectClientBox={selectBoxSize} />
      )}
      {Array.from(tempPos).map((value) => (
        <MousePoint src={value[1]} key={value[0]} />
      ))}
      {liveStore.map((value, index) => {
        const { id: key, attachment } = value;
        // console.log(key);
        if (key.startsWith(svgTypeEnum.rect)) {
          return (
            <RectSVG
              id={key}
              key={key}
              handleSelect={handleSelect}
              showPos={true}
              attachment={attachment}
              deleteSvgById={deleteSvgById}
              setAdditionalProps={setAdditionalProps}
            />
          );
        }

        if (key.startsWith(svgTypeEnum.text)) {
          return (
            <TextSVG
              id={key}
              key={key}
              handleSelect={handleSelect}
              showPos={true}
              attachment={attachment}
              deleteSvgById={deleteSvgById}
              setAdditionalProps={setAdditionalProps}
            />
          );
        }

        if (key.startsWith(svgTypeEnum.line)) {
          return (
            <SimpleLineSVG
              id={key}
              key={key}
              handleSelect={handleSelect}
              showPos={true}
              attachment={attachment}
              deleteSvgById={deleteSvgById}
              setAdditionalProps={setAdditionalProps}
            />
          );
        }

        if (key.startsWith(svgTypeEnum.path)) {
          return (
            <PathSVG
              id={key}
              key={key}
              handleSelect={handleSelect}
              showPos={true}
              attachment={attachment}
              deleteSvgById={deleteSvgById}
              setAdditionalProps={setAdditionalProps}
            />
          );
        }
      })}
    </div>
  );
};
