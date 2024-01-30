import { useEffect, useState } from "react";
import { SvgIdAndMutablePropsManager } from "../eventTarget/SvgIdAndMutablePropsManager";
import { WindowManager } from "../eventTarget/WindowManager";

export const useSvgStore = () => {
  const WM = WindowManager.getInstance();
  const [store, setStore] = useState(
    new Map().set(WM.getSelectedVirtualWindow(), new Map()),
  );
  const [liveStore, setLiveStore] = useState([]);
  const [refreshLiveStore, setRefreshLiveStore] = useState(false);

  const load = (loadData) => {
    const SIM = SvgIdAndMutablePropsManager.getInstance();
    const WM = WindowManager.getInstance();
    const loadMap = new Map();

    for (const [key, value] of Object.entries(loadData)) {
      console.log("window", key);

      const replaceUnderBarWindow = key.replace("_", " ");
      const windowMap = new Map();

      for (const [id, props] of Object.entries(value)) {
        const parse = JSON.parse(props);
        windowMap.set(id, parse);
        const svgType = id.substring(0, 1);
        const num = parseInt(id.substring(1));

        SIM.safeSetIdOnLoad(svgType, num);
      }

      WM.bannerAddOnLoad(replaceUnderBarWindow);
      loadMap.set(replaceUnderBarWindow, windowMap);
    }

    console.log("load map", loadMap);
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

  const onWindowChange = () => {
    const currentWindow = WM.getSelectedVirtualWindow();
    const currentSvgMap = store.get(currentWindow);

    if (!currentSvgMap) {
      setStore((prev) => new Map(prev).set(currentWindow, new Map()));
      console.log(currentWindow, "added");

      return;
    }

    // setRefreshLiveStore(true);
    setRefreshLiveStore((prev) => !prev);
  };

  useEffect(() => {
    const updatedLiveSvg = [];
    const currentWindow = WM.getSelectedVirtualWindow();
    const currentSvgMap = store.get(currentWindow);

    console.log("useEffect", currentWindow, store);

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
  }, [store, refreshLiveStore]);

  return {
    addSvgOnStore,
    updateSvgOnStore,
    setAdditionalProps,
    liveStore,
    onWindowChange,
    load,
  };
};
