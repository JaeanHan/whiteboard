import { SvgContainer } from "./SvgContainer";

export const PathSVG = ({ id, handleSelect, showPos, attachment }) => {
  const { src, width, height, parseArray } = attachment;

  const path =
    `M${parseArray[0].x} ${parseArray[0].y} ` +
    parseArray.map((point) => `L${point.x} ${point.y}`).join(" ");

  console.log("path svg", path);
  return (
    <SvgContainer
      id={id}
      handleSelect={handleSelect}
      init={true}
      src={src}
      showPos={showPos}
    >
      <svg
        width={width + 20}
        height={height + 20}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={path}
          stroke="black"
          fill="none"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </svg>
    </SvgContainer>
  );
};
