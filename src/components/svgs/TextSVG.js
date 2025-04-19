import { SvgContainer } from "../SvgContainer/SvgContainer";
import { useEffect, useRef, useState } from "react";
import { SvgIdAndMutablePropsManager } from "../../eventTarget/SvgIdAndMutablePropsManager";

const fontStyle = {
  fontFamily: "Arial",
  fontSize: 30,
  fill: "black",
  lineHeight: 1,
  whiteSpace: 'pre-line'
};


const calculateTextSize = (text = "", height=80) => {
  const canvas =
      calculateTextSize.canvas ||
      (calculateTextSize.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");

  const textSpilt = text.split("\n") ?? [];

  context.font = `${fontStyle.fontSize}px ${fontStyle.fontFamily}`;

  const lengths = [];

  for (const text of textSpilt) {
    lengths.push(context.measureText(text).width);
  }

  return {
    width: Math.max(...lengths),
    height: Math.max(height, textSpilt.length * 31),
  };
};


export const TextSVG = ({
  id,
  handleSelect,
  showPos,
  attachment,
  deleteSvgById,
  setAdditionalProps,
}) => {
  const { src, width, height, comment } = attachment;
  //test1test2test3;'Leckerli One', cursive.red
  const [text, setText] = useState(comment || "enter text here");
  const [widthHeight, setWidthHeight] = useState({
    width: width,
    height: height,
  });
  const [isHovered, setHovered] = useState(false);
  const [lockFocused, setLockFocused] = useState(false);
  const SIMP = SvgIdAndMutablePropsManager.getInstance();
  const textAreaRef = useRef(null);

  console.log(widthHeight)
  useEffect(() => {
    if (comment) {
      console.log('?', comment)
      setWidthHeight(calculateTextSize(comment));
    }
  }, [setWidthHeight]);

  const convertTextToLines = (text) => {
    let yOffset = 0;

    return text.split("\n").map((line, index) => {
      if (line === "") {
        yOffset += fontStyle.fontSize;
        return null;
      }

      const [context, styleInfo] = line.split(";");
      let font = fontStyle.fontFamily;
      let fill = fontStyle.fill;

      if (styleInfo) {
        [font, fill] = styleInfo.split(".");
      }

      const dy = yOffset;
      yOffset = fontStyle.fontSize;

      return (
        <tspan x="0" dy={dy} key={index} fontFamily={font} fill={fill}>
          {context}
        </tspan>
      );
    });
  };

  const onTextChange = (e) => {
    setLockFocused(true);
    setText(e.target.value);
    const widthHeight = calculateTextSize(e.target.value);
    setWidthHeight(widthHeight);
    SIMP.setCommentMap(id, e.target.value);
    // SIMP.setSizeMap();

    if (!lockFocused) {
      setTimeout(() => setLockFocused(false), 1000);
    }
  };

  const onMouseEnter = (e) => {
    e.stopPropagation();
    setHovered(true);
  };

  const onMouseLeave = () => {
    if (lockFocused) return;
    setHovered(false);
  };

  // const onMouseMove = (e) => {
  //   if (e.button === 1) {
  //     console.log("draging");
  //   }
  // };

  const stopPropagation = (e) => {
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
      shouldUpdate={true}
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
              ref={textAreaRef}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                display: "block",
                border: "none",
                resize: "none",
                padding: 0,
                caretColor: "darkred",
                ...fontStyle,
              }}
              onFocus={(e) => {
                const element = e.target;

                element.focus();
                element.setSelectionRange(
                  element.value.length,
                  element.value.length,
                );
              }}
              autoFocus={true}
              value={text}
              onChange={onTextChange}
              onKeyDown={stopPropagation}
              // onMouseMove={onMouseMove}
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
