import { SvgContainer } from "./SvgContainer/SvgContainer";
import { useRef, useState} from "react";
import {ImageResizer} from "./ImageResizer";

const maxHImg = 1200;
const maxWImg = 1200;

export const ImageContainer = ({
  id,
  handleSelect,
  showPos,
  attachment,
  deleteSvgById,
  setAdditionalProps,
}) => {
  const { src, width, height, imgSrc } = attachment;
  const imageRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [widthHeight, setWidthHeight] = useState(
      {
        width: width ?? 150,
        height: height ?? 150
      }
  )

  const onResizeStart = (direction) => {
    setIsResizing(true);
  };

  const onResizeEnd = (
      nextWidth,
      nextHeight
  ) => {
    setWidthHeight({width: nextWidth, height: nextHeight})
    setIsResizing(false);
  };

  return (
    <SvgContainer
      id={id}
      handleSelect={handleSelect}
      showPos={showPos}
      src={src}
      className={id}
      deleteSvgById={deleteSvgById}
      widthHeight={widthHeight}
      setAdditionalProps={setAdditionalProps}
    >
      <img alt={"no image src"}  src={imgSrc} ref={imageRef} style={{objectFit: 'contain'}} width="100%" height="100%" />
      <ImageResizer
          imageRef={imageRef}
          maxW={maxWImg}
          maxH={maxHImg}
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}
      />
    </SvgContainer>
  );
};
