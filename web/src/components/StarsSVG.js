import { useEffect, useState } from "react";
import { SvgContainer } from "./SvgContainer";
import { toolBarWidth } from "./ToolBar";
import { ThrottleManager } from "../eventTarget/ThrottleManager";
import { StarsSizeStore } from "../eventTarget/StarsSizeStore";

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
  const [draggingIndex, setDraggingIndex] = useState(null);

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
    const xArray = points.map((point) => point.x);
    const yArray = points.map((point) => point.y);
    const width = Math.max(...xArray) + starRadius;
    const height = Math.max(...yArray) + starRadius;
    StarsSizeStore.getInstance().setSizeMap(id, {
      width: width,
      height: height,
    });
  };

  const onDragStart = (index) => {
    setDraggingIndex(index);
  };

  const onDrag = (e) => {
    if (draggingIndex === null) {
      return;
    }
    e.stopPropagation();

    const TM = ThrottleManager.getInstance();
    if (TM.getEventThrottling(TM.moveStarEvent)) return;

    const newPoints = [...points];
    const newDest = {
      x: e.clientX + window.scrollX - toolBarWidth - src.x,
      y: e.clientY + window.scrollY - src.y,
    };
    newPoints[draggingIndex] = newDest;
    setPoints(newPoints);

    setTimeout(() => {
      TM.setEventMap(TM.moveStarEvent, false);
    }, 500);
  };

  const onDragEnd = () => {
    setDraggingIndex(null);
  };

  const xArray = points.map((point) => point.x);
  const yArray = points.map((point) => point.y);
  const width = Math.max(...xArray) + starRadius;
  const height = Math.max(...yArray) + starRadius;

  // state로 만들까
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
      />,
    );
  }

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
            style={{ cursor: "all-scroll" }}
          />
        ))}
      </svg>
    </SvgContainer>
  );
};
