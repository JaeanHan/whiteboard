import { useEffect, useState } from "react";
import { eventNameEnum, svgTypeEnum } from "../utils/enums";
import { useSvgIdGenerator } from "./useSvgIdGenerator";

export const MMMKey = {
  minX: "minX",
  minY: "minY",
  maxX: "maxX",
  maxY: "maxY",
};

export const useTrajectoryLineManager = (setPosMap, setCurrentEvent) => {
  const { generateNextId } = useSvgIdGenerator();

  const [cnt, setCnt] = useState(0);
  const [points, setPoints] = useState([]);
  const [minMaxMap, setMinMaxMap] = useState(new Map());

  useEffect(() => {
    if (cnt === 0) {
      initMinMaxMap();
      return;
    }

    if (points.length === cnt) {
      const key = svgTypeEnum.trajectory + generateNextId();

      setPosMap((prev) => new Map(prev).set(key, { points, minMaxMap }));

      setCnt(0);
      setPoints([]);
      setCurrentEvent(eventNameEnum.none);
    }
  }, [points]);

  const setAmountWillingToUse = (amount) => {
    if (cnt === 0) {
      setCnt(amount);
    }
  };

  const initMinMaxMap = () => {
    setMinMaxMap(() => {
      const mapInit = new Map();

      mapInit
        .set(MMMKey.minX, 9999)
        .set(MMMKey.maxX, 0)
        .set(MMMKey.minY, 9999)
        .set(MMMKey.maxY, 0);

      return mapInit;
    });
  };

  const addPointOnTable = (point) => {
    setPoints((prev) => [...prev, point]);

    setMinMaxMap(() => {
      const mapUpdate = new Map();

      mapUpdate
        .set(MMMKey.minX, Math.min(minMaxMap.get(MMMKey.minX), point.x))
        .set(MMMKey.maxX, Math.max(minMaxMap.get(MMMKey.maxX), point.x))
        .set(MMMKey.minY, Math.min(minMaxMap.get(MMMKey.minY), point.y))
        .set(MMMKey.maxY, Math.max(minMaxMap.get(MMMKey.maxY), point.y));

      return mapUpdate;
    });
  };

  return { addPointOnTable, setAmountWillingToUse };
};
