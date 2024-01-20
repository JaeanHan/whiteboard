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
    let yOffset = 0;

    return text.split("\n").map((line, index) => {
      if (line === "") {
        yOffset += fontStyle.fontSize;
        return null;
      }

      const dy = yOffset;
      yOffset = fontStyle.fontSize;

      return (
        <tspan x="0" dy={dy} key={index}>
          {line}
        </tspan>
      );
    });
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

    return {
      width: metrics.width * longestText.length,
      height: Math.max(height, textSpilt.length * 31),
      // height: Math.max(height, textSpilt.length * fontStyle.fontSize),
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
  };

  const onMouseLeave = () => {
    setHovered(false);
  };

  const onMouseMove = (e) => {
    if (e.button === 1) {
      console.log("draging");
    }
  };

  const stopPropagation = (e) => {
    // e.stopPropagation();
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
                resize: "none",
                padding: 0,
                ...fontStyle,
              }}
              autoFocus={true}
              value={text}
              onChange={onTextChange}
              onMouseMove={onMouseMove}
              // onKeyDown={stopPropagation}
              // onMouseDown={stopPropagation}
            />
          </foreignObject>
        ) : (
          <text
            style={fontStyle}
            textAnchor="start"
            dominantBaseline="hanging"
            y="4px"
          >
            {convertTextToLines(text)}
          </text>
        )}
      </svg>
    </SvgContainer>
  );
};
