import { useEffect, useState } from "react";
import { SvgIdAndMutablePropsManager } from "../eventTarget/SvgIdAndMutablePropsManager";
import { WindowManager } from "../eventTarget/WindowManager";

export const useSvgStore = () => {
  const WM = WindowManager.getInstance();
  const [store, setStore] = useState(
    new Map().set(WM.getSelectedVirtualWindow(), new Map()),
  );
  const [liveStore, setLiveStore] = useState([]);
  const [isInit, setIsInit] = useState(true);

  const load = (loadData) => {
    if (!isInit) return;
    setIsInit(false);

    const SIM = SvgIdAndMutablePropsManager.getInstance();
    const loadMap = new Map();

    for (const [key, value] of Object.entries(loadData)) {
      const parse = JSON.parse(value);
      const svgType = key.substring(0, 1);
      const id = parseInt(key.substring(1));

      SIM.safeSetIdOnLoad(svgType, id);
      loadMap.set(key, parse);
    }

    console.log(loadMap);
    setStore(loadMap);
  };

  const addSvgOnStore = (id, posInfo) => {
    const currentWindow = WM.getSelectedVirtualWindow();
    const props = {
      ...posInfo,
      display: true,
    };

    setStore((prev) => {
      const currentWindowMap = prev.get(currentWindow);
      currentWindowMap.set(id, props);
      return new Map([...prev, currentWindowMap]);
    });
  };

  const updateSvgOnStore = (id, display) => {
    const currentWindow = WM.getSelectedVirtualWindow();
    const props = { ...store.get(currentWindow).get(id), display: display };

    setStore((prev) => {
      const currentWindowMap = prev.get(currentWindow);
      currentWindowMap.set(id, props);
      return new Map([...prev, currentWindowMap]);
    });
  };

  const setAdditionalProps = (id, handleObj) => {
    const currentWindow = WM.getSelectedVirtualWindow();
    const props = { ...store.get(currentWindow).get(id), ...handleObj };

    setStore((prev) => {
      const currentWindowMap = prev.get(currentWindow);
      currentWindowMap.set(id, props);
      return new Map([...prev, currentWindowMap]);
    });
  };

  useEffect(() => {
    const updatedLiveSvg = [];
    const currentWindow = WM.getSelectedVirtualWindow();
    const currentSvgMap = store.get(currentWindow);
    console.log("wtf", currentWindow, currentSvgMap, store);

    for (const [key, value] of currentSvgMap) {
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

    const timer = () => setTimeout(() => setLiveStore(updatedLiveSvg), 5);
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
