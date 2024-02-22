import { useEffect, useState } from "react";
import { dragStateEnum, svgTypeEnum } from "../utils/enums";
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
    // console.log("prop src updated", id, src);
  }, [setObjPos]);

  const getObjInfo = () => {
    return { objPos, objSize };
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
      console.log("prop src updated", id, src);
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
    // e.preventDefault();
    if (dragState === dragStateEnum.none) {
      addSvgToGroup(id, { getObjInfo, moveOnDrag, stopOnDrop });
      setDragState(dragStateEnum.select);
    }
  };

  // const onMouseMove = (e) => {
  //   // 드래그 안돼
  //   // e.stopPropagation();
  // };

  const onMouseUpScaleUp = (e) => {
    e.stopPropagation();
    setScale((prev) => prev + 0.02);
  };

  const onMouseUpScaleDown = (e) => {
    e.stopPropagation();
    setScale((prev) => prev - 0.02);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
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
              ? id.startsWith(svgTypeEnum.text)
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
            backgroundColor: "black",
            color: "black",
            display: "flex",
            left: objSize.width,
            width: 48,
            justifyContent: "space-around",
            alignItems: "center",
            height: 16,
            textAlign: "center",
            lineHeight: 0.75,
            overflow: "visible",
            borderRadius: 2,
          }}
        >
          <div
            style={{
              borderRadius: "50%",
              width: 13,
              height: 13,
              backgroundColor: "green",
              cursor: "zoom-in",
              border: "1px solid gray",
              textAlign: "center",
            }}
            onMouseDown={stopPropagation}
            onMouseUp={onMouseUpScaleUp}
          >
            +
          </div>
          <div
            style={{
              borderRadius: "50%",
              width: 13,
              height: 13,
              backgroundColor: "yellow",
              cursor: "zoom-out",
              border: "1px solid gray",
            }}
            onMouseDown={stopPropagation}
            onMouseUp={onMouseUpScaleDown}
          >
            -
          </div>
          <div
            style={{
              borderRadius: 6,
              width: 13,
              height: 13,
              backgroundColor: "red",
              cursor: "not-allowed",
              border: "1px solid gray",
            }}
            onMouseDown={stopPropagation}
            onMouseUp={() => {
              deleteSvgById(id);
            }}
          >
            x
          </div>
          <div
            style={{
              position: "absolute",
              left: -objSize.width,
              top: 1,
              width: objSize.width,
              height: 2,
              backgroundColor: "black",
            }}
          ></div>
        </div>
      )}
      {showPos && (
        <>
          <div
            style={{ position: "absolute", color: "black", top: -35, left: 10 }}
          >
            x:{objPos.x}px
          </div>
          <div
            style={{
              position: "absolute",
              color: "black",
              top: -20,
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
