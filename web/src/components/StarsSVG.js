import { useEffect, useState } from "react";
import { SvgContainer } from "./SvgContainer";

export const StarsSVG = ({
  id,
  handleSelect,
  showPos,
  attachment,
  deleteSvgById,
  setAdditionalProps,
}) => {
  const { src, width, height, stars, starRadius } = attachment;
  const [points, setPoints] = useState(stars);
  const [links, setLinks] = useState([]);

  useEffect(() => {
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

    console.log("lines", lines);
    setLinks(lines);
  }, [points]);

  // const handleDrag = (e, index) => {
  //   const newPoints = [...points];
  //   newPoints[index] = {
  //     x: e.clientX - toolBarWidth + window.scrollX - src.x,
  //     y: e.clientY + window.scrollY - src.y,
  //   };
  //   console.log("newPo", newPoints[index]);
  //   setPoints(newPoints);
  // };

  return (
    <SvgContainer
      id={id}
      handleSelect={handleSelect}
      init={true}
      src={src}
      showPos={showPos}
      deleteSvgById={deleteSvgById}
      widthHeight={{ width: width, height: height }}
      setAdditionalProps={setAdditionalProps}
    >
      <svg width={width} height={height}>
        {links}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={starRadius}
            fill="blue"
            // onMouseDown={(e) => handleDrag(e, index)}
            // style={{ cursor: "grab" }}
          />
        ))}
      </svg>
    </SvgContainer>
  );
};
