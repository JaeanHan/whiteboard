import { ReactComponent } from "../svgs/rect.svg";
import { SvgContainer } from "./SvgContainer";
export const RectSVG = ({
  containerRef,
  id,
  selectSvg,
  addSvgToGroup,
  removeSvgFromGroup,
  isGrouping,
}) => {
  return (
    <SvgContainer
      containerRef={containerRef}
      id={id}
      selectSvg={selectSvg}
      addSvgToGroup={addSvgToGroup}
      removeSvgFromGroup={removeSvgFromGroup}
      isGrouping={isGrouping}
    >
      <ReactComponent fill={id % 2 === 0 ? "red" : "green"} />
    </SvgContainer>
  );
};
