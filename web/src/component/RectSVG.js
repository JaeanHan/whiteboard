import { ReactComponent as Rect } from "../svgs/rect.svg";
import { SvgContainer } from "./SvgContainer";
export const RectSVG = ({ id, handleSelect, showPos, src }) => {
  // const num = id.replace(/[^0-9]/g, "");
  const num = Number(id.charAt(1));
  console.log(id);
  return (
    <SvgContainer
      id={id}
      handleSelect={handleSelect}
      showPos={showPos}
      src={src}
    >
      <Rect fill={num % 2 === 0 ? "red" : "green"} />
    </SvgContainer>
  );
};
