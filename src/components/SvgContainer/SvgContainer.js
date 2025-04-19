import {memo, useEffect, useState} from "react";
import { dragStateEnum, svgTypeEnum } from "../../utils/enums";
import { GroupEventManager } from "../../eventTarget/GroupEventManager";
import { SvgIdAndMutablePropsManager } from "../../eventTarget/SvgIdAndMutablePropsManager";

import styles from "./svg-container.module.css";


const scale = 1;
const SIMP = SvgIdAndMutablePropsManager.getInstance();

export const SvgContainer = memo(({
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
  shouldUpdate=false,
  updateWidthHeightOnStore = (a) => {},
}) => {
  const { selectSvg, addSvgToGroup, removeSvgFromGroup } = handleSelect;
  const [objPos, setObjPos] = useState({ x: src.x, y: src.y });
  // const [objSize, setObjSize] = useState({
  //   width: widthHeight.width,
  //   height: widthHeight.height,
  // });
  // const [scale, setScale] = useState(1.0);
  const [dragState, setDragState] = useState(dragStateEnum.none);

  useEffect(() => {
    setObjPos(src);
    setAdditionalProps(id, {
      getObjInfo,
      moveOnDrag,
      stopOnDrop,
      setDragStateGroup,
    });
    // console.log("prop src updated", id, src);
  }, [src]);

  const getObjInfo = () => {
    const objSize = {
      width: widthHeight.width,
      height: widthHeight.height,
    };
    return { objPos, objSize};
  };
  const moveOnDrag = (dragPos) => {
    setObjPos(dragPos);
  };
  const stopOnDrop = (isGrouping, finnishFlag) => {
    if (!isGrouping || finnishFlag) {
      setAdditionalProps(id, {
        getObjInfo,
        moveOnDrag,
        stopOnDrop,
        setDragStateGroup,
      });
      // console.log("prop src updated", id, src);
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
    if (
      dragState === dragStateEnum.group ||
      dragState === dragStateEnum.scaling
    )
      return;

    removeSvgFromGroup(id);
    setDragState(dragStateEnum.none);
  };
  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.ctrlKey && dragState === dragStateEnum.group) {
      // console.log("remove", id);
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
    // e.preventDefault();
    if (dragState === dragStateEnum.none) {
      addSvgToGroup(id, { getObjInfo, moveOnDrag, stopOnDrop });
      setDragState(dragStateEnum.select);
    }
    // console.log(dragState);
  };

  // const onMouseMove = (e) => {
  //   // 드래그 안돼
  //   // e.stopPropagation();
  // };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onClick={onClick}
      id={id}
      key={id}
      className={
          `${styles.container} ${dragState === dragStateEnum.select && id.startsWith(svgTypeEnum.image) ? 'editor-image' : ''} ${dragState === dragStateEnum.drag && styles.grabbing}`
      }
      style={{
        opacity: id.startsWith(svgTypeEnum.image) ? 1 : 0.5,
        transformOrigin: isLine ? "0% 0%" : "50% 50%",
        transform: isLine
          ? `rotate(${degrees}deg) scale(${scale})`
          : `scale(${scale})`,
        outline:
          dragState === dragStateEnum.group
            ? "dotted black"
            : dragState === dragStateEnum.select
              ? id.startsWith(svgTypeEnum.image)
                ? 'rgb(60, 132, 244) solid'
                : id.startsWith(svgTypeEnum.text)
                  ? "none"
                  : "dashed "
              : "none",
        top: objPos.y,
        left: objPos.x,
      }}
    >
      {dragState === dragStateEnum.select && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "red",
            color: "black",
            left: 0,
            width: 13,
            justifyContent: "space-around",
            alignItems: "center",
            height: 13,
            textAlign: "center",
            lineHeight: 0.75,
            borderRadius: "50%",
            cursor: "default",
          }}
          onMouseDown={stopPropagation}
          onMouseUp={() => {
            SIMP.setIdUpdateFlagMap(id);
            deleteSvgById(id);
          }}
        >
          x
        </div>
      )}
      {showPos && (
        <>
          <div
            style={{ position: "absolute", color: "black", top: -20, left: 0 }}
          >
            x:{objPos.x}px
          </div>
          <div
            style={{
              position: "absolute",
              color: "black",
              top: -10,
              left: 0,
            }}
          >
            y:{objPos.y}px
          </div>
        </>
      )}
      {children}
    </div>
  );
}, (prev, next) => {
  if (prev.id.startsWith(svgTypeEnum.text)) {
    return false;
  }
  return (
      prev.id === next.id &&
      prev.src?.x === next.src?.x &&
      prev.src?.y === next.src?.y
  );
})
