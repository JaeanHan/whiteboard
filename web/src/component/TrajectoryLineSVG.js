import { useEffect, useState } from "react";
import { SvgContainer } from "./SvgContainer";
import { toolBarWidth } from "./ToolBar";
import { MMMKey } from "../hooks/useTrajectoryLineManager";

export const TrajectoryLineSVG = ({
  id,
  handleSelect,
  showPos,
  src,
  points,
  minMaxMap,
}) => {
  const generatePath = () => {
    const leftTop = {
      x: minMaxMap.get(MMMKey.minX) + 10,
      y: minMaxMap.get(MMMKey.minY) + 10,
    };

    const transform = points.map((point) => {
      return {
        x: point.x - minMaxMap.get(MMMKey.minX) + 50,
        y: point.y - minMaxMap.get(MMMKey.minY) + 10,
      };
    });
    let path = `M ${transform[0].x} ${transform[0].y}`;

    for (let i = 1; i < transform.length; i++) {
      const prevPoint = transform[i - 1];
      const currentPoint = transform[i];
      const cx =
        i === transform.length - 1
          ? currentPoint.x
          : (prevPoint.x + currentPoint.x) / 2;
      const cy =
        i === transform.length - 1
          ? currentPoint.y
          : (prevPoint.y + currentPoint.y) / 2;

      path += ` Q ${prevPoint.x} ${prevPoint.y} ${cx} ${cy}`;
    }

    console.log("table", path, transform);

    return path;
  };

  const viewBox = `${minMaxMap.get(MMMKey.minX) - 10} ${
    minMaxMap.get(MMMKey.minY) - 10
  } ${minMaxMap.get(MMMKey.maxX) - minMaxMap.get(MMMKey.minX) + 20} ${
    minMaxMap.get(MMMKey.maxY) - minMaxMap.get(MMMKey.minY) + 20
  }`;

  return (
    <SvgContainer
      id={id}
      handleSelect={handleSelect}
      showPos={showPos}
      src={src}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        width={minMaxMap.get(MMMKey.maxX) - minMaxMap.get(MMMKey.minX) + 200}
        height={minMaxMap.get(MMMKey.maxY) - minMaxMap.get(MMMKey.minY) + 200}
      >
        <path
          d={generatePath()}
          fill="none"
          stroke="dodgerblue"
          strokeWidth="2"
        />
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="3" fill="black" />
        ))}
      </svg>
    </SvgContainer>
  );
};
