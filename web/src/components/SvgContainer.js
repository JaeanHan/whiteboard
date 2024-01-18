import { useEffect, useState } from "react";
import { dragStateEnum } from "../utils/enums";
import { GroupEventManager } from "../eventTarget/GroupEventManager";

export const SvgContainer = ({
  children,
  id,
  handleSelect,
  showPos,
  degrees,
  isLine = false,
  src = { x: 0, y: 0 },
  deleteSvgById,
  widthHeight = { width: 150, height: 150 },
  setAdditionalProps,
}) => {
  const { selectSvg, addSvgToGroup, removeSvgFromGroup } = handleSelect;
  const [objPos, setObjPos] = useState({ x: src.x, y: src.y });
  const [objSize, setObjSize] = useState({
    width: widthHeight.width,
    height: widthHeight.height,
  });
  const [dragState, setDragState] = useState(dragStateEnum.none);

  useEffect(() => {
    setObjPos(src);
    setAdditionalProps(id, {
      getObjInfo,
      moveOnDrag,
      stopOnDrop,
      setDragStateGroup,
    });
  }, [src]);

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
  const setDragStateGroup = () => setDragState(dragStateEnum.group);

  const onMouseEnter = () => {
    if (!GroupEventManager.getInstance().getGroupingState()) {
      selectSvg(id, { getObjInfo, moveOnDrag, stopOnDrop });
      setDragState(dragStateEnum.select);
    }
  };
  const onMouseLeave = () => {
    if (dragState === dragStateEnum.group) return;
    removeSvgFromGroup(id);
    setDragState(dragStateEnum.none);
  };
  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
  const onMouseDown = (e) => {
    e.preventDefault();
    if (dragState === dragStateEnum.none) {
      addSvgToGroup(id, { getObjInfo, moveOnDrag, stopOnDrop });
      setDragState(dragStateEnum.select);
    }
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onClick={onClick}
      id={id}
      key={id}
      style={{
        cursor: "pointer",
        boxSizing: "border-box",
        width: "max-content",
        height: "max-content",
        position: "absolute",
        opacity: "0.5",
        transformOrigin: isLine ? "0% 0%" : "50% 50%",
        transform: isLine ? "rotate(" + degrees + "deg)" : "",
        border:
          dragState === dragStateEnum.group
            ? "dotted black"
            : dragState === dragStateEnum.select
              ? "dashed"
              : "none",
        top: objPos.y,
        left: objPos.x,
      }}
    >
      {(dragState === dragStateEnum.group ||
        dragState === dragStateEnum.select) && (
        <div
          style={{
            borderRadius: 6,
            position: "absolute",
            backgroundColor: "red",
            color: "black",
            width: 15,
            height: 15,
            top: 0,
            left: objSize.width - 15,
            textAlign: "center",
            lineHeight: 0.75,
            cursor: "not-allowed",
          }}
          onClick={() => {
            deleteSvgById(id);
          }}
        >
          x
        </div>
      )}
      {showPos && (
        <>
          <div
            style={{ position: "absolute", color: "black", top: 0, left: 10 }}
          >
            x:{objPos.x}px
          </div>
          <div
            style={{
              position: "absolute",
              color: "black",
              top: 15,
              left: 10,
            }}
          >
            y:{objPos.y}px
          </div>
        </>
      )}

      {children}
    </div>
  );
};
