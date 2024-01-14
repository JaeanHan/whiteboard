import { useEffect, useState } from "react";

export const useSvgStore = () => {
  const [store, setStore] = useState(new Map());
  const [liveStore, setLiveStore] = useState([]);

  const addSvgOnStore = (id, posInfo) => {
    const props = {
      ...posInfo,
      display: true,
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
    const liveSvg = [];
    for (const [key, value] of store) {
      if (value.display) {
        const viewProps = {
          id: key,
          attachment: value,
        };
        liveSvg.push(viewProps);
      }
    }
    console.log("svgStore", liveSvg);
    setLiveStore(liveSvg);
  }, [store]);

  return {
    addSvgOnStore,
    updateSvgOnStore,
    setAdditionalProps,
    liveStore,
  };
};
