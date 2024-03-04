import { useEffect, useState } from "react";
import { SvgIdAndMutablePropsManager } from "../eventTarget/SvgIdAndMutablePropsManager";
import { WindowManager } from "../eventTarget/WindowManager";
import { svgTypeEnum } from "../utils/enums";

export const useSvgStore = () => {
  const WM = WindowManager.getInstance();
  const [store, setStore] = useState(
    new Map().set(WM.getSelectedVirtualWindow(), new Map()),
  );
  const [liveStore, setLiveStore] = useState([]);
  const [refreshLiveStore, setRefreshLiveStore] = useState(false);
  const SIMP = SvgIdAndMutablePropsManager.getInstance();

  const load = (loadData) => {
    const WM = WindowManager.getInstance();
    SIMP.resetUpdateFlagMap();
    const loadMap = new Map();

    for (const [key, value] of Object.entries(loadData)) {
      // console.log("window", key);

      const underBarReplacedWindow = key.replace("_", " ");
      const windowMap = new Map();

      for (const [id, props] of Object.entries(value)) {
        const parse = JSON.parse(props);

        parse.display = true;

        windowMap.set(id, parse);
        const svgType = id.substring(0, 1);
        const num = parseInt(id.substring(1));

        SIMP.safeSetIdOnLoad(svgType, num);
        SIMP.setIdSrcMapOnLoad(id, parse?.src);

        if (
          id.startsWith(svgTypeEnum.text) ||
          id.startsWith(svgTypeEnum.rect)
        ) {
          SIMP.setCommentMapOnLoad(id, parse?.comment);
        } else if (id.startsWith(svgTypeEnum.stars)) {
          SIMP.setStarsPosMapOnLoad(id, parse?.stars);
        }
      }

      WM.bannerAddOnLoad(underBarReplacedWindow);
      loadMap.set(underBarReplacedWindow, windowMap);
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

  const updateSvgAttachmentOnStore = (id, attachment) => {};

  const hideSvgOnStore = (id, display) => {
    const currentWindow = WM.getSelectedVirtualWindow();
    const props = { ...store.get(currentWindow).get(id), display: display };

    console.log("hide", id);

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

  const cleanUpStore = () => {
    // setLiveStore([]);
    setStore(new Map());
  };

  useEffect(() => {
    const updatedLiveSvg = [];
    const currentWindow = WM.getSelectedVirtualWindow();
    const currentSvgMap = store.get(currentWindow);

    // console.log("[useSvgStore] useEffect", currentWindow, store);

    for (const [key, value] of currentSvgMap) {
      // if (value.display && value.window === currentWindow) {
      if (value.display) {
        const viewProps = {
          id: key,
          attachment: { ...value, src: SIMP.getSrcById(key) ?? value.src },
          // attachment: { ...value },
        };

        updatedLiveSvg.push(viewProps);
      }
    }
    // console.log("svgStore", updatedLiveSvg);

    const timer = () => setTimeout(() => setLiveStore(updatedLiveSvg), 5);
    const name = timer();

    return () => clearTimeout(name);
  }, [store, refreshLiveStore]);

  return {
    addSvgOnStore,
    hideSvgOnStore,
    setAdditionalProps,
    liveStore,
    store: store.get(WindowManager.getInstance().getSelectedVirtualWindow()),
    onWindowChange,
    load,
    cleanUpStore,
  };
};
