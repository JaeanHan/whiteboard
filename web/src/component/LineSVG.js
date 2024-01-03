import { SvgContainer } from "./SvgContainer";
export const LineSVG = ({
  id,
  selectSvg,
  addSvgToGroup,
  removeSvgFromGroup,
  showPos,
  src = { x: 10, y: 10 },
  dest = { x: 100, y: 100 },
}) => {
  const distance = Math.sqrt(
    (src.x - dest.x) * (src.x - dest.x) + (src.y - dest.y) * (src.y - dest.y),
  );
  const theta = Math.atan2(dest.y - src.y, dest.x - src.x);
  const degrees = (theta * 180) / Math.PI;

  console.log("src, dest, distance, degree", src, distance, degrees);

  return (
    <SvgContainer
      id={id}
      selectSvg={selectSvg}
      addSvgToGroup={addSvgToGroup}
      removeSvgFromGroup={removeSvgFromGroup}
      degrees={degrees}
      init={true}
      src={src}
      showPos={showPos}
    >
      <svg width={distance} height={20} xmlns="http://www.w3.org/2000/svg">
        <line
          x1={0}
          y1={0}
          x2={distance}
          y2={0}
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <animate
            attributeName="x2"
            values={`0;${distance}`}
            dur="1s"
            fill="freeze"
            repeatCount="1"
          />
        </line>
      </svg>
    </SvgContainer>
  );
};
