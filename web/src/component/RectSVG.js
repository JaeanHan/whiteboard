import { ReactComponent } from "../svgs/rect.svg";
import { SvgContainer } from "./SvgContainer";
export const RectSVG = ({
  containerRef,
  id,
  addSvgToGroup,
  removeSvgFromGroup,
}) => {
  return (
    <SvgContainer
      containerRef={containerRef}
      id={id}
      addSvgToGroup={addSvgToGroup}
      removeSvgFromGroup={removeSvgFromGroup}
    >
      <ReactComponent />
    </SvgContainer>
  );
};
