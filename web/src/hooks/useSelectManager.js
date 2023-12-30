import { useEffect, useState } from "react";

const prefix = "useSelectManager";

export const useSelectManager = () => {
  const [selectedSvgIds, setSelectedSvgIds] = useState(new Set());

  const addSvgToGroup = (id) => {
    console.log(prefix, "add", id, selectedSvgIds);

    setSelectedSvgIds((prev) => new Set([...prev, id]));
  };

  const removeSvgFromGroup = (id) => {
    console.log(prefix, "remove", id, selectedSvgIds);

    setSelectedSvgIds((prev) => new Set([...prev].filter((e) => e !== id)));
  };

  useEffect(() => {
    console.log(prefix, "use effect", selectedSvgIds);
  }, [selectedSvgIds]);

  return { addSvgToGroup, removeSvgFromGroup };
};
