import { useSvgIdGenerator } from "./useSvgIdGenerator";
import { useEffect, useState } from "react";
import { eventNameEnum, svgTypeEnum } from "../utils/enums";

export const useStarsGenerator = (
  addSvgOnStore,
  setCurrentEvent,
  setTempPos,
) => {
  const { generateNextId } = useSvgIdGenerator();
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (points.length === 0) return;

    const threeSecWatch = () =>
      setTimeout(() => {
        if (points.length > 2) {
          handleTimeout();
          setTempPos(new Map());
        }
      }, 3000);

    const name = threeSecWatch();
    console.log("test");

    return () => {
      clearTimeout(name);
    };
  }, [points]);

  const handleTimeout = () => {
    if (points.length === 0) return;
    const key = svgTypeEnum.stars + generateNextId();

    const xArray = points.map((point) => point.x);
    const yArray = points.map((point) => point.y);

    const starRadius = 5;
    const src = {
      x: Math.min(...xArray) - starRadius,
      y: Math.min(...yArray) - starRadius,
    };
    const width = Math.max(...xArray) - src.x + starRadius;
    const height = Math.max(...yArray) - src.y + starRadius;

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
      width,
      height,
      stars,
      starRadius,
    };
    console.log("create ", key);
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
