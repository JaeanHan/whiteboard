import { useEffect, useState } from "react";
import { SMStateEnum } from "../utils/enums";
import {
  calcPosOnDrag,
  generateDiffAndFlag,
  setMoveMapByKey,
} from "../utils/selectManagerTools";
import {
  GroupEventManager,
  GroupKeyMapKey,
} from "../eventTarget/GroupEventManager";
import { SvgIdAndMutablePropsManager } from "../eventTarget/SvgIdAndMutablePropsManager";

export const useSelectManager = () => {
  const [svgGroup, setSvgGroup] = useState(new Map());
  const [diffAndFlagMap, setDiffAndFlagMap] = useState(new Map());
  const [SMState, setSMState] = useState(SMStateEnum.none);
  const [selectBoxSize, setSelectBoxSize] = useState({
    src: { x: 0, y: 0 },
    dest: { x: 0, y: 0 },
  });
  const isGrouping = GroupEventManager.getInstance().getGroupingState();
  const SIMP = SvgIdAndMutablePropsManager.getInstance();

  useEffect(() => {
    const moveOnKeyDown = () => {
      const GKM = GroupEventManager.getInstance().getGroupKeyMoveMap();

      for (const [key, value] of svgGroup) {
        const moveOnDrag = value.moveOnDrag;
        const { objPos } = value.getObjInfo();
        const movePos = {
          x: objPos.x + GKM.get(GroupKeyMapKey.x),
          y: objPos.y + GKM.get(GroupKeyMapKey.y),
        };

        moveOnDrag(movePos);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "F5" || e.key === "F12") return;

      e.preventDefault();
      e.stopPropagation();

      if (!GroupEventManager.getInstance().getGroupingState()) return;

      setMoveMapByKey(e.key);
      moveOnKeyDown();
      GroupEventManager.getInstance().goFaster();
      console.log(e.key);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);

      if (svgGroup.size === 0) {
        GroupEventManager.getInstance().resetGroupKeyMoveMap();
      }
      GroupEventManager.getInstance().settleDown();
    };
  }, [svgGroup]);

  const setDiffPosOnAll = (clientPos) => {
    // if (SMState === SMStateEnum.select)
    for (const [key, value] of svgGroup) {
      const { objPos, objSize } = value.getObjInfo();

      const clientX = clientPos.x;
      const clientY = clientPos.y;
      const objX = objPos.x;
      const objX2 = objX + objSize.width;
      const objY = objPos.y;
      const objY2 = objY + objSize.height;

      const idProps = generateDiffAndFlag(
        objX,
        objX2,
        objY,
        objY2,
        clientX,
        clientY,
      );
      setDiffAndFlagMap((prev) => new Map(prev).set(key, idProps));
    }

    setSMState(SMStateEnum.drag);
  };

  const onDrag = (dragPos) => {
    if (svgGroup.size === 0 || SMState !== SMStateEnum.drag) return;

    for (const [key, value] of svgGroup) {
      if (!diffAndFlagMap.has(key)) continue;

      const { diffDistance, flag } = diffAndFlagMap.get(key);
      const moveOnDrag = value.moveOnDrag;
      const fixPos = calcPosOnDrag(flag, dragPos, diffDistance);

      moveOnDrag(fixPos);
    }
  };

  const onDrop = () => {
    if (svgGroup.size > 0 && SMState === SMStateEnum.drag) {
      svgGroup.forEach((value, key) => {
        const stopOnDrop = value.stopOnDrop;

        stopOnDrop(isGrouping, true);
      });
      removeAllSvg();
      setSMState(SMStateEnum.none);

      const quitGroupEvent = new CustomEvent(GroupEventManager.eventName, {
        bubbles: true,
        cancelable: true,
        detail: {
          isGrouping: false,
        },
      });

      GroupEventManager.getInstance().dispatchEvent(quitGroupEvent);
    }
  };

  const selectSvg = (id, objTools) => {
    setSvgGroup(() => {
      return new Map().set(id, objTools);
    });
    setSMState(SMStateEnum.select);
  };

  const addSvgToGroup = (id, objTools) => {
    setSvgGroup((prev) => new Map([...prev, [id, objTools]]));
    setSMState(SMStateEnum.select);

    const insertGroupEvent = new CustomEvent(GroupEventManager.eventName, {
      bubbles: true,
      cancelable: true,
      detail: {
        isGrouping: true,
      },
    });

    GroupEventManager.getInstance().dispatchEvent(insertGroupEvent);
  };

  const removeSvgFromGroup = (id) => {
    setSvgGroup((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  const removeAllSvg = () => {
    setSvgGroup(new Map());
  };

  const initClientSelectBoxSize = (fixPos) => {
    if (isGrouping) return false;

    setSelectBoxSize({
      src: fixPos,
      dest: fixPos,
    });

    return true;
  };

  const setClientSelectBoxSize = (fixPos) => {
    setSelectBoxSize((prev) => {
      return {
        src: prev.src,
        dest: fixPos,
      };
    });
  };

  const getSelectBoxBounding = () => {
    const leftTop = {
      x: Math.min(selectBoxSize.src.x, selectBoxSize.dest.x),
      y: Math.min(selectBoxSize.src.y, selectBoxSize.dest.y),
    };
    const width = Math.abs(selectBoxSize.src.x - selectBoxSize.dest.x);
    const height = Math.abs(selectBoxSize.src.y - selectBoxSize.dest.y);
    return {
      left: leftTop.x,
      top: leftTop.y,
      right: leftTop.x + width,
      bottom: leftTop.y + height,
    };
  };

  const getObjBounding = (objSrc, width, height, key) => {
    const startSize = SIMP.getSizeById(key);
    return {
      left: objSrc.x,
      top: objSrc.y,
      right: objSrc.x + (width ?? startSize.width),
      bottom: objSrc.y + (height ?? startSize.height),
    };
  };

  const isOverlapped = (selectBoxBounding, objBounding) => {
    const overlapWidth =
      Math.min(selectBoxBounding.right, objBounding.right) -
      Math.max(selectBoxBounding.left, objBounding.left);
    const overlapHeight =
      Math.min(selectBoxBounding.bottom, objBounding.bottom) -
      Math.max(selectBoxBounding.top, objBounding.top);

    return overlapWidth > 0 && overlapHeight > 0;
  };

  const finClientSelectBoxSize = (liveStore) => {
    const selectBoxBounding = getSelectBoxBounding();

    liveStore.map((props) => {
      const { id: key, attachment } = props;
      const {
        src: objSrc,
        width,
        height,
        getObjInfo,
        moveOnDrag,
        stopOnDrop,
        setDragStateGroup,
      } = attachment;
      const rectBounding = getObjBounding(objSrc, width, height, key);

      if (isOverlapped(selectBoxBounding, rectBounding)) {
        addSvgToGroup(key, { getObjInfo, moveOnDrag, stopOnDrop });
        setDragStateGroup();
      }
    });

    setTimeout(() => {
      setSelectBoxSize({
        src: { x: 0, y: 0 },
        dest: { x: 0, y: 0 },
      });
    }, 100);
  };

  return {
    handleSelect: {
      selectSvg,
      addSvgToGroup,
      removeSvgFromGroup,
      removeAllSvg,
    },
    setDiffPosOnAll,
    onDrag,
    onDrop,
    selectBoxSize,
    handleSelectBox: {
      initClientSelectBoxSize,
      setClientSelectBoxSize,
      finClientSelectBoxSize,
    },
  };
};
