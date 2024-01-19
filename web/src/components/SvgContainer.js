import { useEffect, useState } from "react";
import { dragStateEnum } from "../utils/enums";
import { GroupEventManager } from "../eventTarget/GroupEventManager";
import { toolBarWidth } from "./ToolBar";

const localThrottlingMap = new Map();
const localScaleSrcMap = new Map();

/***
 * @param func 콜백 함수
 * @param id svg 키
 * @param delay
 * @param args 콜백 함수 매개변수들
 */
const localThrottling = (func, id, delay, ...args) => {
  if (localThrottlingMap.get(id)) return;

  localThrottlingMap.set(id, true);
  setTimeout(() => {
    func(args);
    localThrottlingMap.set(id, false);
  }, delay);
};

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
  updateWidthHeightOnStore = (a) => {},
}) => {
  const { selectSvg, addSvgToGroup, removeSvgFromGroup } = handleSelect;
  const [objPos, setObjPos] = useState({ x: src.x, y: src.y });
  const [objSize, setObjSize] = useState({
    width: widthHeight.width,
    height: widthHeight.height,
  });
  const [scale, setScale] = useState(1);
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

  useEffect(() => {
    // setObjSize(widthHeight);
    updateWidthHeightOnStore(widthHeight);
  }, [widthHeight]);

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

    if (e.ctrlKey && dragState === dragStateEnum.group) {
      console.log("remove", id);
      removeSvgFromGroup(id);
      setDragState(dragStateEnum.none);
      return;
    }

    if (e.ctrlKey) {
      addSvgToGroup(id, { getObjInfo, moveOnDrag, stopOnDrop });
      setDragState(dragStateEnum.group);
    }
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    if (dragState === dragStateEnum.none) {
      addSvgToGroup(id, { getObjInfo, moveOnDrag, stopOnDrop });
      setDragState(dragStateEnum.select);
    }
  };

  const onMouseMove = (e) => {
    // 드래그 안돼
    // e.stopPropagation();
  };

  const onMouseUpScaleUp = (e) => {
    e.stopPropagation();
    setScale((prev) => prev + 0.02);
  };

  const onMouseUpScaleDown = (e) => {
    e.stopPropagation();
    setScale((prev) => prev - 0.02);
  };

  const onMouseDownScaleButton = (e) => {
    e.stopPropagation();
    // const srcPos = {
    //   // x: e.clientX + window.scrollX - toolBarWidth - src.x,
    //   y: e.clientY + window.scrollY - src.y,
    // };
    // localScaleSrcMap.set(id, srcPos);
  };

  // const onMouseMoveScaleButton = (e) => {
  //   e.stopPropagation();

  // if (e.buttons === 1) {
  //   const src = {
  //     x: objPos.x + objSize.width - 15,
  //     y: objPos.y + objSize.height - 15,
  //   };
  //   const destY = e.clientY + window.scrollY - src.y;
  //
  //   const calcScaleOnDrag = (diff) => {
  //     setScale((prev) => prev + diff);
  //   };
  //
  //   localThrottling(calcScaleOnDrag, id, 10, src.y < destY ? 0.2 : -0.2);

  // const diff = (src.y - destY) / 100;

  // const btnPos = objPos.y - 15;
  // const destY = e.clientY + window.scrollY - src.y;

  // setScale((prev) => prev + (btnPos > destY ? 0.02 : -0.02));

  // console.log("distance", diff);
  // setObjSize((prev) => {
  //   return {
  //     width: prev.width + diff,
  //     height: prev.height + diff,
  //   };
  // });

  // console.log(fixPos);
  // }
  // };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
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
        transform: isLine
          ? `rotate(${degrees}deg) scale(${scale})`
          : `scale(${scale})`,
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
      {dragState === dragStateEnum.select && (
        <>
          <div
            style={{
              borderRadius: 6,
              position: "absolute",
              backgroundColor: "red",
              color: "black",
              width: 15,
              height: 15,
              left: objSize.width - 15,
              textAlign: "center",
              lineHeight: 0.75,
              cursor: "not-allowed",
            }}
            onMouseUp={() => {
              deleteSvgById(id);
            }}
          >
            x
          </div>
          <svg
            style={{
              borderRadius: 2,
              border: "solid 1px white",
              position: "absolute",
              backgroundColor: "none",
              color: "black",
              width: 30,
              height: 15,
              // top: objSize.height - 15,
              left: objSize.width - 45,
              textAlign: "center",
              lineHeight: 0.75,
              // cursor: scale > 1 ? "zoom-out" : "zoom-in",
            }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              style={{ cursor: "zoom-in" }}
              x="0"
              y="0"
              width="50%"
              height="100%"
              fill="green"
              onMouseUp={onMouseUpScaleUp}
              onMouseDown={onMouseDownScaleButton}
            />
            <rect
              style={{ cursor: "zoom-out" }}
              x="50%"
              y="0"
              width="50%"
              height="100%"
              fill="yellow"
              onMouseUp={onMouseUpScaleDown}
              onMouseDown={onMouseDownScaleButton}
            />
          </svg>

          {/*<div*/}
          {/*  style={{*/}
          {/*    borderRadius: 6,*/}
          {/*    position: "absolute",*/}
          {/*    backgroundColor: "white",*/}
          {/*    color: "black",*/}
          {/*    width: 15,*/}
          {/*    height: 15,*/}
          {/*    top: objSize.height - 15,*/}
          {/*    left: objSize.width - 15,*/}
          {/*    textAlign: "center",*/}
          {/*    lineHeight: 0.75,*/}
          {/*    cursor: scale > 1 ? "zoom-out" : "zoom-in",*/}
          {/*  }}*/}
          {/*  // onMouseDown={onMouseDownScaleButton}*/}
          {/*  // onMouseMove={onMouseMoveScaleButton}*/}
          {/*  onMouseUp={onMouseUpScaleButton}*/}
          {/*>*/}
          {/*  +*/}
          {/*</div>*/}
        </>
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
