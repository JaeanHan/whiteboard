import { useSvgIdGenerator } from "./useSvgIdGenerator";
import { useEffect, useState } from "react";
import { eventNameEnum, svgTypeEnum } from "../utils/enums";

export const useLineGenerator = (
  addSvgOnStore,
  setCurrentEvent,
  setTempPos,
) => {
  const { generateNextId } = useSvgIdGenerator();
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (points.length > 1) {
      const key = svgTypeEnum.line + generateNextId();
      const src = points[0];
      const dest = points[1];
      const width = Math.sqrt(
        (src.x - dest.x) * (src.x - dest.x) +
          (src.y - dest.y) * (src.y - dest.y),
      );
      const height = 20;
      const attachment = {
        src,
        dest,
        width,
        height,
      };

      // setPosMap((prev) => new Map(prev).set(key, fixPos));
      addSvgOnStore(key, attachment);
      setCurrentEvent(eventNameEnum.none);
      setPoints([]);

      setTimeout(() => {
        setTempPos(new Map());
      }, 2500);
    }
  }, [points]);

  const addPoint = (point) => {
    setPoints((prev) => [...prev, point]);
  };

  const quit = () => {
    setPoints([]);
  };

  return {
    addPoint,
    quit,
  };
};
