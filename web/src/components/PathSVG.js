import { SvgContainer } from "./SvgContainer";

export const PathSVG = ({
  id,
  handleSelect,
  showPos,
  attachment,
  deleteSvgById,
  setAdditionalProps,
}) => {
  const { src, width, height, parseArray, thickness } = attachment;

  const path = `M${parseArray[0].x} ${parseArray[0].y} ${parseArray
    .map((point) => `L${point.x} ${point.y}`)
    .join(" ")}`;

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
      <svg
        width={width + thickness / 2}
        height={height + thickness / 2}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={path}
          stroke="black"
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
        />
      </svg>
    </SvgContainer>
  );
};
