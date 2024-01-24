import { SvgContainer } from "../SvgContainer";
export const LineSVG = ({
  id,
  handleSelect,
  showPos,
  attachment,
  deleteSvgById,
  setAdditionalProps,
}) => {
  const { src, dest, width, height } = attachment;
  const theta = Math.atan2(dest.y - src.y, dest.x - src.x);
  const degrees = (theta * 180) / Math.PI;

  // console.log(src, dest, distance, degrees);

  // const fixedDegrees = degrees < 0 ? degrees + 360 : degrees;
  // const transformRad = (theta + 270) * (Math.PI / 180);
  // const slope = Math.tan(transformRad);
  //
  // const isDirectingUpper = fixedDegrees > 180 && fixedDegrees < 360;
  //
  // const offsetX = 10 / Math.sqrt(1 + slope * slope);
  // const OffsetY =
  //   fixedDegrees < 270 ? fixedDegrees - 180 : 2 * (fixedDegrees - 250);
  //
  // const fixX = isDirectingUpper ? src.x - offsetX : src.x;
  // const fixY = isDirectingUpper ? src.y - 24 + OffsetY * 0.025 : src.y;
  //
  // const transformedX = fixX + 10 / Math.sqrt(1 + slope * slope);
  // const transformedY = fixY + (10 * slope) / Math.sqrt(1 + slope * slope);
  //
  // const test = {
  //   x: Math.round(transformedX),
  //   y: Math.round(transformedY),
  // };

  return (
    <SvgContainer
      id={id}
      handleSelect={handleSelect}
      degrees={degrees}
      isLine={true}
      src={src}
      showPos={showPos}
      deleteSvgById={deleteSvgById}
      widthHeight={{ width: width, height: height }}
      setAdditionalProps={setAdditionalProps}
    >
      <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
        <line
          x1={0}
          y1={0}
          x2={width}
          y2={0}
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <animate
            attributeName="x2"
            values={`0;${width}`}
            dur="1s"
            fill="freeze"
            repeatCount="1"
          />
        </line>
      </svg>
    </SvgContainer>
  );
};
