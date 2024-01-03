import { useState } from "react";

export const useSvgIdGenerator = () => {
  const [ids, setIds] = useState([0]);

  const generateNextId = () => {
    setIds((prev) => [...prev, prev.length]);
    console.log("storage length", ids.length);
    return ids.length;
  };

  const removeId = (sId) => {
    const filteredId = ids.filter((id) => id !== sId);
    setIds(filteredId);
  };

  return { ids, generateNextId, removeId };
};
