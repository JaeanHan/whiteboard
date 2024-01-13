import { SvgContainer } from "./SvgContainer";
import { useState } from "react";
export const TextSVG = ({
  id,
  handleSelect,
  showPos,
  attachment,
  deleteSvgById,
  setAdditionalProps,
}) => {
  const { src, width, height } = attachment;
  const [text, setText] = useState("test1test2test3");
  const [widthHeight, setWidthHeight] = useState({
    width: width,
    height: height,
  });
  const [isHovered, setHovered] = useState(false);

  const onTextChange = (e) => {
    setText(e.target.value);
  };

  const onMouseEnter = () => {
    setHovered(true);
  };

  const onMouseLeave = () => {
    setHovered(false);
  };

  const fontStyle = {
    fontFamily: "Arial",
    fontSize: 30,
    fill: "black",
    textAnchor: "middle",
    dominantBaseline: "middle",
  };

  return (
    <SvgContainer
      id={id}
      handleSelect={handleSelect}
      init={true}
      src={src}
      showPos={showPos}
      deleteSvgById={deleteSvgById}
      widthHeight={widthHeight}
      setAdditionalProps={setAdditionalProps}
    >
      <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <input
          type="text"
          style={{
            position: "absolute",
            width: widthHeight.width,
            height: widthHeight.height,
            boxSizing: "border-box",
            left: 100,
            top: 40,
            transform: "translate(-50%, -50%)",
            display: isHovered ? "block" : "none",
            border: "none",
            ...fontStyle,
          }}
          value={text}
          onChange={onTextChange}
        />
        <svg
          width={widthHeight.width}
          height={widthHeight.height}
          xmlns="http://www.w3.org/2000/svg"
        >
          <text x="105" y="50" style={fontStyle}>
            {text}
          </text>
          {/*<foreignObject width="100%" height="100%">*/}
          {/*  <input*/}
          {/*    type="text"*/}
          {/*    style={{*/}
          {/*      position: "absolute",*/}
          {/*      top: "50%",*/}
          {/*      left: "90%",*/}
          {/*      transform: "translate(-50%, -50%)",*/}
          {/*      display: isHovered ? "block" : "none",*/}
          {/*    }}*/}
          {/*    value={text}*/}
          {/*    onChange={onTextChange}*/}
          {/*  />*/}
          {/*</foreignObject>*/}
        </svg>
      </div>
    </SvgContainer>
  );
};
