import { useEffect, useState } from "react";
import { eventNameEnum, svgTypeEnum } from "../utils/enums";
import { SvgIdAndMutablePropsManager } from "../eventTarget/SvgIdAndMutablePropsManager";

export const useStarsGenerator = (
  addSvgOnStore,
  setCurrentEvent,
  setTempPos,
) => {
  const generateNextId =
    SvgIdAndMutablePropsManager.getInstance().generateNextId;
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (points.length === 0) return;

    const timer = () =>
      setTimeout(
        () => {
          if (points.length > 2) {
            handleTimeout();
            setTempPos(new Map());
          }
        },
        2500 - Math.min(1000, 200 * points.length),
      );

    const name = timer();
    console.log("test");

    return () => {
      clearTimeout(name);
    };
  }, [points]);

  const handleTimeout = () => {
    if (points.length === 0) return;
    const key = generateNextId(svgTypeEnum.stars);

    const xArray = points.map((point) => point.x);
    const yArray = points.map((point) => point.y);

    const starRadius = 5;
    const src = {
      x: Math.min(...xArray) - starRadius,
      y: Math.min(...yArray) - starRadius,
    };
    // const width = Math.max(...xArray) - src.x + starRadius;
    // const height = Math.max(...yArray) - src.y + starRadius;

    const stars = [];

    for (const point of points) {
      const star = {
        x: point.x - src.x,
        y: point.y - src.y,
      };
      stars.push(star);
    }

    const attachment = {
      src,
      // width,
      // height,
      stars,
      starRadius,
    };
    console.log("create ", key, attachment);
    setPoints([]);
    addSvgOnStore(key, attachment);
    setCurrentEvent(eventNameEnum.none);
  };

  const addStar = (point) => {
    setPoints((prev) => [...prev, point]);
  };

  const quit = () => {
    setPoints([]);
  };

  return {
    addStar,
    quit,
  };
};
