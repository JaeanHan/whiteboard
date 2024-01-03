import { ReactComponent as Rect } from "../svgs/rect.svg";
import { SvgContainer } from "./SvgContainer";
export const RectSVG = ({
  id,
  selectSvg,
  addSvgToGroup,
  removeSvgFromGroup,
  showPos,
  src,
}) => {
  // const num = id.replace(/[^0-9]/g, "");
  const num = Number(id.charAt(1));
  return (
    <SvgContainer
      id={id}
      selectSvg={selectSvg}
      addSvgToGroup={addSvgToGroup}
      removeSvgFromGroup={removeSvgFromGroup}
      showPos={showPos}
      src={src}
    >
      <Rect fill={num % 2 === 0 ? "red" : "green"} />
    </SvgContainer>
  );
};
