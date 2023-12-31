import { ReactComponent as Rect } from "../svgs/rect.svg";
import { SvgContainer } from "./SvgContainer";
export const RectSVG = ({
  containerRef,
  id,
  selectSvg,
  addSvgToGroup,
  removeSvgFromGroup,
  isGrouping,
  showPos,
}) => {
  return (
    <SvgContainer
      containerRef={containerRef}
      id={id}
      selectSvg={selectSvg}
      addSvgToGroup={addSvgToGroup}
      removeSvgFromGroup={removeSvgFromGroup}
      isGrouping={isGrouping}
      showPos={showPos}
    >
      <Rect fill={id % 2 === 0 ? "red" : "green"} />
    </SvgContainer>
  );
};
