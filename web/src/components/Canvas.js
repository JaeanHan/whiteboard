import { useSelectManager } from "../hooks/useSelectManager";
import { RectSVG } from "./RectSVG";
import { TextSVG } from "./TextSVG";
import { useEffect, useState } from "react";
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

  const [tempPos, setTempPos] = useState(new Map());
  const [cursorMode, setCursorMode] = useState(cursorModeEnum.default);
  const [isErasing, setIsErasing] = useState(false);

  const { addPoint, quit } = useLineGenerator(
    addSvgOnStore,
    setCurrentEvent,
    setTempPos,
  );

  const { addPointOnSet, setIsDrawing } = usePathGenerator(addSvgOnStore);

  const deleteSvgById = (id) => {
    updateSvgOnStore(id, false);
  };

  const onMouseDown = (e) => {
    if (cursorMode === cursorModeEnum.erase) {
      setIsErasing(true);
      return;
    }

    if (cursorMode === cursorModeEnum.write) {
      setIsDrawing(true);
      return;
    }

    const id = e.target.parentNode?.parentNode?.id;

    if (currentEvent === eventNameEnum.none && id && id === "root") {
      const fixPos = {
        x: e.clientX - toolBarWidth,
        y: e.clientY,
      };

      if (initClientSelectBoxSize(fixPos)) {
        setCurrentEvent(eventNameEnum.multiSelect);
        return;
      }
    }

    setDiffPosOnAll({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const onMouseMove = (e) => {
    if (cursorMode === cursorModeEnum.erase && isErasing) {
      const id = e.target.parentNode?.parentNode?.id;
      if (id && id !== "root") {
        deleteSvgById(id);
      }
      return;
    }

    if (cursorMode === cursorModeEnum.write) {
      const fixPos = {
        x: e.clientX - toolBarWidth,
        y: e.clientY,
      };
      addPointOnSet(fixPos);
      return;
    }

    if (currentEvent === eventNameEnum.multiSelect) {
      const clientPos = { x: e.clientX - toolBarWidth, y: e.clientY };
      setClientSelectBoxSize(clientPos);
      return;
    }

    if (currentEvent === eventNameEnum.none) {
      const calcPos = { x: e.clientX, y: e.clientY };
      onDrag(calcPos);
    }
  };

  const onMouseUp = (e) => {
    if (cursorMode === cursorModeEnum.erase) {
      setIsErasing(false);
      return;
    }

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
      x: e.clientX - toolBarWidth,
      y: e.clientY,
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

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "white",
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
