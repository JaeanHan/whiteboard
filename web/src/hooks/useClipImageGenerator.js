import { SvgIdAndMutablePropsManager } from "../eventTarget/SvgIdAndMutablePropsManager";
import { useEffect, useState } from "react";
import { eventNameEnum, svgTypeEnum } from "../utils/enums";

export const useClipImageGenerator = (addSvgOnStore, setCurrentEvent) => {
  const SIMP = SvgIdAndMutablePropsManager.getInstance();
  const generateNextId = SIMP.generateNextId;
  const [src, setSrc] = useState(null);

  const handleOnReaderLoad = (result) => {
    const img = new Image();

    img.onload = () => {
      const key = generateNextId(svgTypeEnum.image);
      const attachment = {
        src: {
          x: src.x - img.naturalWidth / 2,
          y: src.y - img.naturalHeight / 2,
        },
        width: img.naturalWidth,
        height: img.naturalHeight,
        imgSrc: result,
      };

      console.log("img load", key, img.naturalWidth, img.width);

      addSvgOnStore(key, attachment);
      setSrc(null);
      setCurrentEvent(eventNameEnum.none);
    };

    img.src = result;
  };

  const handleOnReaderLoadEditDpi = (result) => {
    const img = new Image();

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // DPI 조절
      const dpiRatio = 60 / 96;
      canvas.width = img.width * dpiRatio;
      canvas.height = img.height * dpiRatio;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const dpiFixedImgUrl = canvas.toDataURL("image/png");

      const key = generateNextId(svgTypeEnum.image);
      const attachment = {
        src: {
          x: src.x - img.naturalWidth / 2,
          y: src.y - img.naturalHeight / 2,
        },
        width: img.naturalWidth,
        height: img.naturalHeight,
        imgSrc: dpiFixedImgUrl,
      };

      addSvgOnStore(key, attachment);
      setSrc(null);
      setCurrentEvent(eventNameEnum.none);
    };

    img.src = result;
  };

  const loadImageFromClipboard = async (
    handleOnReaderLoad = () => console.log("no reader load handler"),
  ) => {
    const clipboardItems = await navigator.clipboard.read();

    for (const item of clipboardItems) {
      if (item.types.includes("image/png")) {
        const blob = await item.getType("image/png");
        const reader = new FileReader();

        reader.onload = () => handleOnReaderLoad(reader.result);

        reader.readAsDataURL(blob);
        return;
      }
    }

    alert("no png in clipboard");
    setSrc(null);
    setCurrentEvent(eventNameEnum.none);
  };

  useEffect(() => {
    if (src) {
      loadImageFromClipboard(handleOnReaderLoad);
      // loadImageFromClipboard(handleOnReaderLoadEditDpi);
    }
  }, [src]);

  return {
    setClipboardImgSrc: setSrc,
  };
};
