import { SvgContainer } from "./SvgContainer";
export const RectSVG = ({
  id,
  handleSelect,
  showPos,
  attachment,
  deleteSvgById,
  setAdditionalProps,
}) => {
  const { src, width, height } = attachment;
  // const num = id.replace(/[^0-9]/g, "");
  const num = Number(id.charAt(1));
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
      {/*<Rect fill={num % 2 === 0 ? "red" : "green"} />*/}
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
        <rect
          rx="20"
          ry="20"
          width="150"
          height="150"
          fill={num % 2 === 0 ? "red" : "green"}
          style={{ stroke: "black", strokeWidth: 5 }}
        />
        <text x="60" y="50" fill="black" transform="rotate(-30 90,90)">
          {id} SVG Test
        </text>
        Sorry, your browser does not support inline SVG.
      </svg>
    </SvgContainer>
  );
};
