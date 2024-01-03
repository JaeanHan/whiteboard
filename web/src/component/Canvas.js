import { useSelectManager } from "../hooks/useSelectManager";
import { RectSVG } from "./RectSVG";
import { useEffect, useState } from "react";
import { LineSVG } from "./LineSVG";
import { eventNameEnum, svgTypeEnum } from "../utils/enums";
import { useSvgIdGenerator } from "../hooks/useSvgIdGenerator";
import { toolBarWidth } from "./ToolBar";

export const Canvas = ({ currentEvent, setCurrentEvent }) => {
  const {
    selectSvg,
    addSvgToGroup,
    removeSvgFromGroup,
    removeAllSvg,
    setDiffPosOnAll,
    onDrag,
    onDrop,
  } = useSelectManager();
  const { generateNextId } = useSvgIdGenerator();

  const [testClientPos, setTestClientPos] = useState({ x: 0, y: 0 });
  const [tempPos, setTempPos] = useState(new Map());
  const [posMap, setPosMap] = useState(new Map());
  const [cnt, setCnt] = useState(0);

  const onMouseDown = (e) => {
    setDiffPosOnAll({
      x: e.clientX,
      y: e.clientY,
    });
  };
  const onMouseMove = (e) => {
    e.preventDefault();
    setTestClientPos({ x: e.clientX, y: e.clientY });

    if (currentEvent !== eventNameEnum.none) {
      return;
    }

    const clientPos = { x: e.clientX, y: e.clientY };
    onDrag(clientPos);
  };

  const onMouseUp = (e) => {
    if (currentEvent === eventNameEnum.addRect) {
      const key = svgTypeEnum.rect + generateNextId();
      const fixPos = {
        x: e.clientX - toolBarWidth - 75,
        y: e.clientY - 75,
      };

      setPosMap((prev) => new Map(prev).set(key, fixPos));
      setCurrentEvent(eventNameEnum.none);
      return;
    }

    if (currentEvent === eventNameEnum.addLine) {
      if (cnt > 0) {
        const key = svgTypeEnum.line + generateNextId();
        const destPos = {
          x: e.clientX - toolBarWidth,
          y: e.clientY,
        };

        setTempPos((prev) => new Map(prev).set(cnt, destPos));

        const fixPos = {
          src: tempPos.get(0),
          dest: destPos,
        };

        setPosMap((prev) => new Map(prev).set(key, fixPos));
        setCurrentEvent(eventNameEnum.none);
        setCnt(0);
        setTimeout(() => {
          setTempPos(new Map());
        }, 3000);
        return;
      }

      setTempPos((prev) =>
        new Map(prev).set(cnt, {
          x: e.clientX - toolBarWidth,
          y: e.clientY,
        }),
      );
      setCnt((cnt) => cnt + 1);
      return;
    }

    if (!e.ctrlKey) {
      onDrop();
    }
  };

  const onKeyDown = (e) => {
    if (e.ctrlKey && e.shiftKey) {
      console.log("remove detected");
      removeAllSvg();
    }
  };

  useEffect(() => {
    console.log("use effect", currentEvent);
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
      onKeyDown={onKeyDown}
    >
      <div style={{ position: "absolute", color: "black", top: 0, left: 10 }}>
        clientX : {testClientPos.x}
      </div>
      <div style={{ position: "absolute", color: "black", top: 15, left: 10 }}>
        clientY : {testClientPos.y}
      </div>
      {Array.from(tempPos).map((value) => {
        const pos = value[1];
        return (
          <div
            key={value[0]}
            style={{
              position: "absolute",
              width: 20,
              height: 20,
              border: "2px dotted black",
              borderRadius: "50%",
              background: "transparent",
              left: pos.x - 10,
              top: pos.y - 10,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 5,
                height: 5,
                background: "black",
                borderRadius: "50%",
                left: 7.5,
                top: 7.5,
              }}
            ></div>
          </div>
        );
      })}
      {Array.from(posMap).map((value, index) => {
        const key = value[0];
        const pos = value[1];

        if (key.startsWith(svgTypeEnum.rect)) {
          return (
            <RectSVG
              id={key}
              key={key}
              selectSvg={selectSvg}
              addSvgToGroup={addSvgToGroup}
              removeSvgFromGroup={removeSvgFromGroup}
              showPos={true}
              src={pos}
            />
          );
        }

        if (key.startsWith(svgTypeEnum.line)) {
          return (
            <LineSVG
              id={key}
              key={key}
              selectSvg={selectSvg}
              addSvgToGroup={addSvgToGroup}
              removeSvgFromGroup={removeSvgFromGroup}
              showPos={true}
              src={pos.src}
              dest={pos.dest}
            />
          );
        }
      })}
    </div>
  );
};
