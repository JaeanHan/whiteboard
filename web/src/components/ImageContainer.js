import { SvgContainer } from "./SvgContainer";
import { useEffect, useState } from "react";

export const ImageContainer = ({
  id,
  handleSelect,
  showPos,
  attachment,
  deleteSvgById,
  setAdditionalProps,
}) => {
  const { src, width, height, imgSrc } = attachment;

  // console.log("imgSrc", width, height);

  return (
    <SvgContainer
      id={id}
      handleSelect={handleSelect}
      showPos={showPos}
      src={src}
      className={id}
      deleteSvgById={deleteSvgById}
      // widthHeight={{ width: width, height: height }}
      setAdditionalProps={setAdditionalProps}
    >
      <img alt={"no image src"} src={imgSrc} />
    </SvgContainer>
  );
};
