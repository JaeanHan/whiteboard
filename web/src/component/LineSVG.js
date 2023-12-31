import { SvgContainer } from "./SvgContainer";
import { ReactComponent as Line } from "../svgs/line.svg";
import { useState } from "react";
export const LineSVG = ({
  containerRef,
  id,
  selectSvg,
  addSvgToGroup,
  removeSvgFromGroup,
  isGrouping,
}) => {
  const [width, setWidth] = useState(500);
  return (
    <SvgContainer
      containerRef={containerRef}
      id={id}
      selectSvg={selectSvg}
      addSvgToGroup={addSvgToGroup}
      removeSvgFromGroup={removeSvgFromGroup}
      isGrouping={isGrouping}
    >
      <svg width={width + 10} height="20" xmlns="http://www.w3.org/2000/svg">
        <line
          x1="10"
          y1="10"
          x2={width + 10}
          y2="10"
          stroke="black"
          strokeWidth="8"
          strokeLinecap="round"
        >
          <animate
            attributeName="x2"
            values="10;500"
            dur="2s"
            fill="freeze"
            repeatCount="1"
          />
        </line>
      </svg>
    </SvgContainer>
  );
};
