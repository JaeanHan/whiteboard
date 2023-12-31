import { useState } from "react";
import { dragStateEnum } from "../utils/enums";

export const SvgContainer = ({
  children,
  containerRef,
  id,
  selectSvg,
  addSvgToGroup,
  removeSvgFromGroup,
  isGrouping,
  showPos,
}) => {
  const [objPos, setObjPos] = useState({ x: 150 * id, y: 150 * id });
  const [objSize, setObjSize] = useState({ width: 150, height: 150 });
  const [dragState, setDragState] = useState(dragStateEnum.none);

  const getObjInfo = () => {
    return { objPos, objSize };
  };
  const moveOnDrag = (dragPos) => {
    setObjPos(dragPos);
  };
  const stopOnDrop = (isGrouping) => {
    if (!isGrouping) {
      setDragState(dragStateEnum.none);
    }
  };

  const onMouseEnter = () => {
    if (!isGrouping) {
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
