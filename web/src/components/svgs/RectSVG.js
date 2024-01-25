import { SvgContainer } from "../SvgContainer";
import { useState } from "react";
export const RectSVG = ({
  id,
  handleSelect,
  showPos,
  attachment,
  deleteSvgById,
  setAdditionalProps,
}) => {
  const { src, width, height } = attachment;
  const [desc, setDesc] = useState(`${id} description`);
  const num = Number(id.charAt(1));

  const onClick = (e) => {
    if (e.ctrlKey) return;

    e.stopPropagation();

    if (e.shiftKey) {
      const newDesc = prompt("name or description for this block");
      setDesc(newDesc);
    }
  };

  // console.log(id);
  return (
    <SvgContainer
      id={id}
      handleSelect={handleSelect}
      showPos={showPos}
      src={src}
      className={id}
      deleteSvgById={deleteSvgById}
      widthHeight={{ width: width, height: height }}
      setAdditionalProps={setAdditionalProps}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        onClick={onClick}
      >
        <rect
          rx="20"
          ry="20"
          width="150"
          height="150"
          fill={num % 2 === 0 ? "red" : "green"}
          style={{ stroke: "black", strokeWidth: 5 }}
        />
        <text x="60" y="50" fill="black" transform="rotate(-30 90,90)">
          {desc}
        </text>
        Sorry, your browser does not support inline SVG.
      </svg>
    </SvgContainer>
  );
};
