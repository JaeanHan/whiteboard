import { useEffect, useState } from "react";
import { dragStateEnum } from "../utils/enums";
import { GroupEventManager } from "../eventTarget/GroupEventManager";

export const SvgContainer = ({
  children,
  id,
  selectSvg,
  addSvgToGroup,
  removeSvgFromGroup,
  showPos,
  degrees,
  init = false,
  src = { x: 0, y: 0 },
}) => {
  const [objPos, setObjPos] = useState({ x: src.x, y: src.y });
  const [objSize, setObjSize] = useState({ width: 150, height: 150 });
  const [dragState, setDragState] = useState(dragStateEnum.none);

  const getObjInfo = () => {
    return { objPos, objSize };
  };
  const moveOnDrag = (dragPos) => {
    setObjPos(dragPos);
  };
  const stopOnDrop = (isGrouping, finnishFlag) => {
    if (!isGrouping || finnishFlag) {
      setDragState(dragStateEnum.none);
    }
  };

  const onMouseEnter = () => {
    if (!GroupEventManager.getInstance().getGroupingState()) {
      selectSvg(id, { getObjInfo, moveOnDrag, stopOnDrop });
    }
  };
  const onMouseLeave = () => {
    if (dragState === dragStateEnum.group) return;
    removeSvgFromGroup(id);
  };
  const onClick = (e) => {
    e.preventDefault();
    if (!e.ctrlKey) return;

    if (dragState === dragStateEnum.group) {
      console.log("remove", id);
      removeSvgFromGroup(id);
      setDragState(dragStateEnum.none);
      return;
    }

    addSvgToGroup(id, { getObjInfo, moveOnDrag, stopOnDrop });
    setDragState(dragStateEnum.group);
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      id={id}
      style={{
        cursor: "pointer",
        boxSizing: "border-box",
        width: "max-content",
        height: "max-content",
        position: "absolute",
        opacity: "0.5",
        transformOrigin: init ? "0% 0%" : "50% 50%",
        transform: degrees ? "rotate(" + degrees + "deg)" : "",
        border: dragState === dragStateEnum.group ? "dotted black" : "",
        top: objPos.y,
        left: objPos.x,
      }}
    >
      {showPos ? (
        <>
          <div
            style={{ position: "absolute", color: "black", top: 0, left: 10 }}
          >
            x:{objPos.x}px
          </div>
          <div
            style={{ position: "absolute", color: "black", top: 15, left: 10 }}
          >
            y:{objPos.y}px
          </div>
        </>
      ) : (
        ""
      )}

      {children}
    </div>
  );
};
