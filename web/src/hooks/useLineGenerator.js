import { useSvgIdGenerator } from "./useSvgIdGenerator";
import { useEffect, useState } from "react";
import { eventNameEnum, svgTypeEnum } from "../utils/enums";

export const useLineGenerator = (setPosMap, setCurrentEvent, setTempPos) => {
  const { generateNextId } = useSvgIdGenerator();
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (points.length > 1) {
      const key = svgTypeEnum.line + generateNextId();
      const src = points[0];
      const dest = points[1];
      const fixPos = {
        src,
        dest,
      };

      setPosMap((prev) => new Map(prev).set(key, fixPos));
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
