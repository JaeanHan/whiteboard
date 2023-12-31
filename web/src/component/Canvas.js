import { useSelectManager } from "../hooks/useSelectManager";
import { RectSVG } from "./RectSVG";
import { useRef, useState } from "react";
import { LineSVG } from "./LineSVG";

export const Canvas = () => {
  const containerRef = useRef(null);
  const {
    selectSvg,
    addSvgToGroup,
    removeSvgFromGroup,
    removeAllSvg,
    setDiffPosOnAll,
    onDrag,
    onDrop,
    isGrouping,
  } = useSelectManager();

  const [testClientPos, setTestClientPos] = useState({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    setDiffPosOnAll({
      x: e.clientX,
      y: e.clientY,
    });
  };
  const onMouseMove = (e) => {
    e.preventDefault();
    const clientPos = { x: e.clientX, y: e.clientY };
    onDrag(clientPos);
    setTestClientPos({ x: e.clientX, y: e.clientY });
  };

  const onMouseUp = (e) => {
    onDrop();
  };

  const onKeyDown = (e) => {
    if (e.ctrlKey && e.shiftKey) {
      removeAllSvg();
    }
  };

  const temp = [1, 2];

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        backgroundColor: "white",
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
      {temp.map((el) => (
        <RectSVG
          canvasRef={containerRef}
          id={el}
          key={el}
          selectSvg={selectSvg}
          addSvgToGroup={addSvgToGroup}
          removeSvgFromGroup={removeSvgFromGroup}
          isGrouping={isGrouping}
          showPos={true}
        />
      ))}
      <LineSVG
        canvasRef={containerRef}
        id={3}
        key={3}
        selectSvg={selectSvg}
        addSvgToGroup={addSvgToGroup}
        removeSvgFromGroup={removeSvgFromGroup}
        isGrouping={isGrouping}
        showPos={false}
      />
    </div>
  );
};
