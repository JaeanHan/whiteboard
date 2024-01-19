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

  const fontStyle = {
    fontFamily: "Arial",
    fontSize: 30,
    fill: "black",
    lineHeight: 1,
  };

  const convertTextToLines = (text) => {
    return text.split("\n").map((line, index) => (
      // <tspan x="0" dy={`${index === 0 ? 0 : 1}em`} key={index}>
      <tspan x="0" dy={index === 0 ? 0 : fontStyle.fontSize} key={index}>
        {line}
      </tspan>
    ));
  };

  const calculateTextSize = (text = "") => {
    const canvas =
      calculateTextSize.canvas ||
      (calculateTextSize.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");

    const textSpilt = text.split("\n") ?? [];

    const longestText = textSpilt?.reduce(
      (longest, currentLine) =>
        currentLine.length > longest.length ? currentLine : longest,
      "",
    );

    context.font = `${fontStyle.fontSize}px ${fontStyle.fontFamily}`;
    const metrics = context.measureText("Q");

    // const margins = 11;
    // const calcHeight =
    //   metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + margins;

    console.log("woo", textSpilt.length, longestText, metrics.width);

    return {
      width: metrics.width * longestText.length,
      height: Math.max(height, textSpilt.length * 32),
    };
  };

  const onTextChange = (e) => {
    if (e.target.value === "") {
      deleteSvgById(id);
      return;
    }

    setText(e.target.value);
    setWidthHeight(calculateTextSize(e.target.value));
  };

  const onMouseEnter = (e) => {
    e.stopPropagation();
    setHovered(true);
    console.log("hi");
  };

  const onMouseLeave = () => {
    setHovered(false);
    console.log("bye", text);
  };

  const onMouseUp = (e) => {
    if (!e.ctrlKey) {
      e.target.focus();
    }
    // 이거 막으면 드래그인줄 아네
    // e.stopPropagation();
  };

  const onKeyDown = (e) => {
    e.stopPropagation();
  };

  return (
    <SvgContainer
      id={id}
      handleSelect={handleSelect}
      src={src}
      showPos={!isHovered}
      deleteSvgById={deleteSvgById}
      widthHeight={widthHeight}
      setAdditionalProps={setAdditionalProps}
    >
      <svg
        width={widthHeight.width}
        height={widthHeight.height}
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {isHovered ? (
          <foreignObject width="100%" height="100%">
            <textarea
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                display: "block",
                border: "none",
                ...fontStyle,
              }}
              value={text}
              onChange={onTextChange}
              onMouseUp={onMouseUp}
              onKeyDown={onKeyDown}
            />
          </foreignObject>
        ) : (
          <text style={fontStyle} textAnchor="start" dominantBaseline="hanging">
            {convertTextToLines(text)}
          </text>
        )}
      </svg>
    </SvgContainer>
  );
};
