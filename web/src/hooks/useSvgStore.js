import { useEffect, useState } from "react";
import { SvgIdAndMutablePropsManager } from "../eventTarget/SvgIdAndMutablePropsManager";
import { WindowManager } from "../eventTarget/WindowManager";

export const useSvgStore = () => {
  const [store, setStore] = useState(new Map());
  const [liveStore, setLiveStore] = useState([]);
  const [isInit, setIsInit] = useState(true);
  const WM = WindowManager.getInstance();

  const load = (loadData) => {
    if (!isInit) return;
    setIsInit(false);

    const SIM = SvgIdAndMutablePropsManager.getInstance();
    const loadMap = new Map();

    for (const [key, value] of Object.entries(loadData)) {
      const parse = JSON.parse(value);
      const svgType = key.substring(0, 1);
      const id = parseInt(key.substring(1));

      SIM.safeSetId(svgType, id);
      loadMap.set(key, parse);
    }

    console.log(loadMap);
    setStore(loadMap);
  };

  const addSvgOnStore = (id, posInfo) => {
    const currentWindow = WM.getCurrentWindow();
    const props = {
      ...posInfo,
      display: true,
      window: currentWindow,
    };
    setStore((prev) => new Map([...prev, [id, props]]));
  };

  const updateSvgOnStore = (id, display) => {
    const props = { ...store.get(id), display: display };

    setStore((prev) => new Map(prev).set(id, props));
  };

  const setAdditionalProps = (id, handleObj) => {
    const props = { ...store.get(id), ...handleObj };

    setStore((prev) => new Map(prev).set(id, props));
  };

  useEffect(() => {
    const updatedLiveSvg = [];
    const currentWindow = WM.getCurrentWindow();

    for (const [key, value] of store) {
      // if (value.display && value.window === currentWindow) {
      if (value.display) {
        const viewProps = {
          id: key,
          attachment: value,
        };
        updatedLiveSvg.push(viewProps);
      }
    }
    console.log("svgStore", updatedLiveSvg);

    const timer = () => setTimeout(() => setLiveStore(updatedLiveSvg), 6);
    const name = timer();

    return () => clearTimeout(name);
  }, [store]);

  return {
    addSvgOnStore,
    updateSvgOnStore,
    setAdditionalProps,
    liveStore,
    load,
  };
};
