import { useEffect, useState } from "react";
import { SvgContainer } from "../SvgContainer/SvgContainer";
import { sideBarWidth } from "../Sidebar/SideBar";
import { ThrottlingDebouncingManager } from "../../eventTarget/ThrottlingDebouncingManager";
import { SvgIdAndMutablePropsManager } from "../../eventTarget/SvgIdAndMutablePropsManager";

export const StarsSVG = ({
  id,
  handleSelect,
  showPos,
  attachment,
  deleteSvgById,
  setAdditionalProps,
}) => {
  const { src, stars, starRadius } = attachment;
  const [points, setPoints] = useState(stars);
  const [lines, setLines] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const SIMP = SvgIdAndMutablePropsManager.getInstance();

  useEffect(() => {
    const timer = () =>
      setTimeout(() => {
        handleTimeout();
      }, 100);

    const name = timer();

    return () => {
      clearTimeout(name);
    };
  }, [points]);

  const handleTimeout = () => {
    // const xArray = points.map((point) => point.x);
    // const yArray = points.map((point) => point.y);
    // const width = Math.max(...xArray) + starRadius;
    // const height = Math.max(...yArray) + starRadius;
    SIMP.setStarsPosMap(id, points);

    const lines = [];

    for (let i = 0; i < points.length - 1; i++) {
      lines.push(
        <line
          key={i}
          x1={points[i].x}
          y1={points[i].y}
          x2={points[i + 1].x}
          y2={points[i + 1].y}
          stroke="black"
          strokeWidth="2"
        >
          <animate
            attributeName="x2"
            from={points[i].x}
            to={points[i + 1].x}
            dur="1s"
            repeatCount="1"
          />
          <animate
            attributeName="y2"
            from={points[i].y}
            to={points[i + 1].y}
            dur="1s"
            repeatCount="1"
          />
        </line>,
      );
    }

    setLines(lines);
  };

  const onDragStart = (index) => {
    setDraggingIndex(index);
  };

  const onDrag = (e) => {
    if (draggingIndex === null) {
      return;
    }
    e.stopPropagation();

    const TM = ThrottlingDebouncingManager.getInstance();

    if (TM.getEventThrottling(TM.moveStarEvent)) return;

    const newPoints = [...points];
    const newDest = {
      x: e.clientX + window.scrollX - sideBarWidth - src.x,
      y: e.clientY + window.scrollY - src.y,
    };
    newPoints[draggingIndex] = newDest;
    setPoints(newPoints);

    setTimeout(() => {
      TM.setEventMap(TM.moveStarEvent, false);
    }, 500);
  };

  const onDragEnd = () => {
    if (draggingIndex && draggingIndex > 0) {
      const newLines = [...lines];
      const prevLineIndex = draggingIndex - 1;

      newLines[prevLineIndex] = (
        <line
          key={prevLineIndex}
          x1={points[prevLineIndex].x}
          y1={points[prevLineIndex].y}
          x2={points[draggingIndex].x}
          y2={points[draggingIndex].y}
          stroke="black"
          strokeWidth="2"
        >
          <animate
            attributeName="x2"
            from={points[prevLineIndex].x}
            to={points[draggingIndex].x}
            dur="1s"
            fill="freeze"
            repeatCount="1"
          />
          <animate
            attributeName="y2"
            from={points[prevLineIndex].y}
            to={points[draggingIndex].y}
            dur="1s"
            fill="freeze"
            repeatCount="1"
          />
        </line>
      );
      setLines(newLines);
      SvgIdAndMutablePropsManager.getInstance().setIdUpdateFlagMap(id);
    }

    setDraggingIndex(null);
  };

  const xArray = points.map((point) => point.x);
  const yArray = points.map((point) => point.y);
  const width = Math.max(...xArray) + starRadius;
  const height = Math.max(...yArray) + starRadius;

  return (
    <SvgContainer
      id={id}
      handleSelect={handleSelect}
      src={src}
      showPos={showPos}
      deleteSvgById={deleteSvgById}
      widthHeight={{
        width: width,
        height: height,
      }}
      setAdditionalProps={setAdditionalProps}
    >
      <svg
        width={width}
        height={height}
        onMouseMove={onDrag}
        onMouseUp={onDragEnd}
        onMouseLeave={() => setDraggingIndex(null)}
        style={{
          borderTop: draggingIndex === null ? "none" : "dashed dodgerblue",
          borderLeft: draggingIndex === null ? "none" : "dashed dodgerblue",
        }}
      >
        {lines}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={starRadius}
            fill={draggingIndex === index ? "red" : "blue"}
            onMouseDown={(e) => onDragStart(index)}
            onMouseUp={() => console.log("index ===", index)}
            style={{ cursor: "all-scroll" }}
          />
        ))}
      </svg>
    </SvgContainer>
  );
};
