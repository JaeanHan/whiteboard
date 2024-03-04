import { SvgContainer } from "../SvgContainer";
import { useState } from "react";
import { SvgIdAndMutablePropsManager } from "../../eventTarget/SvgIdAndMutablePropsManager";
export const RectSVG = ({
  id,
  handleSelect,
  showPos,
  attachment,
  deleteSvgById,
  setAdditionalProps,
}) => {
  const { src, width, height, comment } = attachment;
  const [desc, setDesc] = useState(comment || `${id} description`);
  const num = Number(id.charAt(1));

  const onClick = (e) => {
    if (e.ctrlKey) return;

    e.stopPropagation();

    if (e.shiftKey) {
      const SIMP = SvgIdAndMutablePropsManager.getInstance();
      const newDesc = prompt("name or description for this block");
      SIMP.setCommentMap(id, newDesc);
      setDesc(newDesc);
    }
  };

  // console.log(id, comment);
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
        >
          <animate
            attributeName="height"
            from="10"
            to="150"
            dur="1s"
            fill="freeze"
          />
          <animate
            attributeName="width"
            from="10"
            to="150"
            dur="1s"
            fill="freeze"
          />
          <animate
            attributeName="x"
            attributeType="XML"
            from="75"
            to="0"
            dur="1s"
            fill="freeze"
          />
          <animate
            attributeName="y"
            attributeType="XML"
            from="75"
            to="0"
            dur="1s"
            fill="freeze"
          />
        </rect>
        {/*<text x="60" y="50" fill="black" transform="rotate(-30 90,90)">*/}
        <text x="75" y="75" fill="black">
          {desc}
        </text>
        Sorry, your browser does not support inline SVG.
      </svg>
    </SvgContainer>
  );
};
