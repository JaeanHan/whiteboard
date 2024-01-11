import { useSelectManager } from "../hooks/useSelectManager";
import { RectSVG } from "./RectSVG";
import { TextSVG } from "./TextSVG";
import { useEffect, useState } from "react";
import { SimpleLineSVG } from "./SimpleLineSVG";
import { eventNameEnum, svgTypeEnum } from "../utils/enums";
import { useSvgIdGenerator } from "../hooks/useSvgIdGenerator";
import { toolBarWidth } from "./ToolBar";
import { useLineGenerator } from "../hooks/useLineGenerator";
import { MousePoint } from "./MousePoint";
import { usePathGenerator } from "../hooks/usePathGenerator";
import { PathSVG } from "./PathSVG";

export const Canvas = ({ currentEvent, setCurrentEvent }) => {
  const { handleSelect, setDiffPosOnAll, onDrag, onDrop } = useSelectManager();
  const { generateNextId } = useSvgIdGenerator();

  const [tempPos, setTempPos] = useState(new Map());
  const [posMap, setPosMap] = useState(new Map());

  const { addPoint, quit } = useLineGenerator(
    setPosMap,
    setCurrentEvent,
    setTempPos,
  );

  const { addPointOnSet, setIsDrawing } = usePathGenerator(setPosMap);

  const onMouseDown = (e) => {
    if (currentEvent === eventNameEnum.addPath) {
      setIsDrawing(true);
      return;
    }

    setDiffPosOnAll({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const onMouseMove = (e) => {
    if (currentEvent === eventNameEnum.addPath) {
      const fixPos = {
        x: e.clientX - toolBarWidth,
        y: e.clientY,
      };
      addPointOnSet(fixPos);
      return;
    }

    if (currentEvent === eventNameEnum.none) {
      const clientPos = { x: e.clientX, y: e.clientY };
      onDrag(clientPos);
    }
  };

  const onMouseUp = (e) => {
    if (currentEvent === eventNameEnum.addPath) {
      setIsDrawing(false);
      setCurrentEvent(eventNameEnum.none);
      return;
    }

    const fixPos = {
      x: e.clientX - toolBarWidth,
      y: e.clientY,
    };

    if (currentEvent === eventNameEnum.addRect) {
      const key = svgTypeEnum.rect + generateNextId();
      const centerPos = {
        x: fixPos.x - 75,
        y: fixPos.y - 75,
      };

      setPosMap((prev) => new Map(prev).set(key, centerPos));
      setCurrentEvent(eventNameEnum.none);
      return;
    }

    if (currentEvent === eventNameEnum.addText) {
      const key = svgTypeEnum.text + generateNextId();
      const centerPos = {
        x: fixPos.x - 100,
        y: fixPos.y - 40,
      };

      setPosMap((prev) => new Map(prev).set(key, centerPos));
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

    // if (currentEvent === eventNameEnum.addTrajectory) {
    //   setAmountWillingToUse(Number(window.prompt("How many points?", "3")));
    // }
  }, [currentEvent]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "white",
        cursor: currentEvent === eventNameEnum.none ? "" : "pointer",
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {Array.from(tempPos).map((value) => (
        <MousePoint value={value} key={value[0]} />
      ))}
      {Array.from(posMap).map((value, index) => {
        const key = value[0];
        const attachment = value[1];

        if (key.startsWith(svgTypeEnum.rect)) {
          return (
            <RectSVG
              id={key}
              key={key}
              handleSelect={handleSelect}
              showPos={true}
              src={attachment}
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
              src={attachment}
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
              src={attachment.src}
              dest={attachment.dest}
            />
          );
        }

        if (key.startsWith(svgTypeEnum.path)) {
          console.log(key, attachment);
          return (
            <PathSVG
              id={key}
              key={key}
              handleSelect={handleSelect}
              showPos={true}
              attachment={attachment}
            />
          );
        }
      })}
    </div>
  );
};
