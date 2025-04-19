import { svgTypeEnum } from "./enums";
import { RectSVG } from "../components/svgs/RectSVG";
import { TextSVG } from "../components/svgs/TextSVG";
import { LineSVG } from "../components/svgs/LineSVG";
import { PathSVG } from "../components/svgs/PathSVG";
import { StarsSVG } from "../components/svgs/StarsSVG";
import { ImageContainer } from "../components/ImageContainer";

export const render = (
  liveStore,
  handleSelect,
  deleteSvgById,
  setAdditionalProps,
) => {
  return liveStore.map((value, index) => {
    const { id: key, attachment } = value;

    if (key.startsWith(svgTypeEnum.rect)) {
      return (
        <RectSVG
          id={key}
          key={`${key}-${attachment.src.x}-${attachment.src.y}`}
          handleSelect={handleSelect}
          showPos={true}
          attachment={attachment}
          deleteSvgById={deleteSvgById}
          setAdditionalProps={setAdditionalProps}
        />
      );
    }

    if (key.startsWith(svgTypeEnum.text)) {
      return (
        <TextSVG
          id={key}
          key={`${key}-${attachment.src.x}-${attachment.src.y}`}
          handleSelect={handleSelect}
          showPos={true}
          attachment={attachment}
          deleteSvgById={deleteSvgById}
          setAdditionalProps={setAdditionalProps}
        />
      );
    }

    if (key.startsWith(svgTypeEnum.line)) {
      return (
        <LineSVG
          id={key}
          key={`${key}-${attachment.src.x}-${attachment.src.y}`}
          handleSelect={handleSelect}
          showPos={true}
          attachment={attachment}
          deleteSvgById={deleteSvgById}
          setAdditionalProps={setAdditionalProps}
        />
      );
    }

    if (key.startsWith(svgTypeEnum.stars)) {
      return (
        <StarsSVG
          id={key}
          key={`${key}-${attachment.src.x}-${attachment.src.y}`}
          handleSelect={handleSelect}
          showPos={true}
          attachment={attachment}
          deleteSvgById={deleteSvgById}
          setAdditionalProps={setAdditionalProps}
        />
      );
    }

    if (key.startsWith(svgTypeEnum.path)) {
      return (
        <PathSVG
          id={key}
          key={`${key}-${attachment.src.x}-${attachment.src.y}`}
          handleSelect={handleSelect}
          showPos={true}
          attachment={attachment}
          deleteSvgById={deleteSvgById}
          setAdditionalProps={setAdditionalProps}
        />
      );
    }

    if (key.startsWith(svgTypeEnum.image)) {
      return (
        <ImageContainer
          id={key}
          key={`${key}-${attachment.src.x}-${attachment.src.y}`}
          handleSelect={handleSelect}
          showPos={true}
          attachment={attachment}
          deleteSvgById={deleteSvgById}
          setAdditionalProps={setAdditionalProps}
        />
      );
    }
  });
};

export const convertSvgToString = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const svgFileContent = await response.text();

    // const base64Encoded = btoa(svgFileContent);
    return svgFileContent;
  } catch (error) {
    console.error("Error converting SVG to string:", error);
    throw error;
  }
};

const createBlobUrl = (data) => {
  return URL.createObjectURL(new Blob([data], { type: "image/svg+xml" }));
};

export const drawSvg = (data) => {
  const canvasDirect = document.getElementById("canvas");
  const ctx = canvasDirect.getContext("2d");
  const url = createBlobUrl(data);

  const img1 = new Image();
  img1.src = url;
  img1.onload = () => {
    ctx.drawImage(img1, 0, 0, 150, 150);
    URL.revokeObjectURL(url);
  };
};
