import { useEffect, useState } from "react";
import { arrowKeysEnum, fitFlagEnum, SMStateEnum } from "../utils/enums";
import {
  calcFit,
  calcLower,
  calcLowerLeft,
  calcLowerRight,
  calcUpper,
  calcUpperLeft,
  calcUpperRight,
  calcXFit,
} from "../utils/selectManagerTools";
import {
  GroupEventManager,
  GroupKeyMapKey,
} from "../eventTarget/GroupEventManager";

export const useSelectManager = () => {
  const [svgGroup, setSvgGroup] = useState(new Map());
  const [diffAndFlagMap, setDiffAndFlagMap] = useState(new Map());
  const [SMState, setSMState] = useState(SMStateEnum.none);
  const isGrouping = GroupEventManager.getInstance().getGroupingState();

  useEffect(() => {
    const moveByKey = () => {
      const GKM = GroupEventManager.getInstance().getGroupKeyMoveMap();

      for (const [value] of svgGroup) {
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
      //이거 하면 새로고침이랑 개발자도구 안켜짐
      // e.preventDefault();
      if (!GroupEventManager.getInstance().getGroupingState()) return;

      const GEM = GroupEventManager.getInstance();
      const GKM = GEM.getGroupKeyMoveMap();

      const previousX = GKM.get(GroupKeyMapKey.x);
      const previousY = GKM.get(GroupKeyMapKey.y);

      if (e.key === arrowKeysEnum.left) {
        const currentX = previousX - 1;
        GKM.set(GroupKeyMapKey.x, currentX);
        moveByKey();
        return;
      }

      if (e.key === arrowKeysEnum.right) {
        const currentX = previousX + 1;
        GKM.set(GroupKeyMapKey.x, currentX);
        moveByKey();
        return;
      }

      if (e.key === arrowKeysEnum.up) {
        const currentY = previousY - 1;
        GKM.set(GroupKeyMapKey.y, currentY);
        moveByKey();
        return;
      }

      if (e.key === arrowKeysEnum.down) {
        const currentY = previousY + 1;
        GKM.set(GroupKeyMapKey.y, currentY);
        moveByKey();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);

      if (svgGroup.size === 0) {
        GroupEventManager.getInstance().resetGroupKeyMoveMap();
      }
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

      if (flag === fitFlagEnum.fit) {
        const fixPos = calcFit(dragPos, diffDistance);
        moveOnDrag(fixPos);
        continue;
      }

      if (flag === fitFlagEnum.xFit) {
        const fixPos = calcXFit(dragPos, diffDistance);
        moveOnDrag(fixPos);
        continue;
      }

      if (flag === fitFlagEnum.upper) {
        const fixPos = calcUpper(dragPos, diffDistance);
        moveOnDrag(fixPos);
        continue;
      }

      if (flag === fitFlagEnum.lower) {
        const fixPos = calcLower(dragPos, diffDistance);
        moveOnDrag(fixPos);
        continue;
      }

      if (flag === fitFlagEnum.upperLeft) {
        const fixPos = calcUpperLeft(dragPos, diffDistance);
        moveOnDrag(fixPos);
        continue;
      }

      if (flag === fitFlagEnum.upperRight) {
        const fixPos = calcUpperRight(dragPos, diffDistance);
        moveOnDrag(fixPos);
        continue;
      }

      if (flag === fitFlagEnum.lowerLeft) {
        const fixPos = calcLowerLeft(dragPos, diffDistance);
        moveOnDrag(fixPos);
        continue;
      }

      if (flag === fitFlagEnum.lowerRight) {
        const fixPos = calcLowerRight(dragPos, diffDistance);
        moveOnDrag(fixPos);
        continue;
      }

      console.log("something not handled !!!", key, value);
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

      const addRectEvent = new CustomEvent(GroupEventManager.eventName, {
        bubbles: true,
        cancelable: true,
        detail: {
          isGrouping: false,
        },
      });

      GroupEventManager.getInstance().dispatchEvent(addRectEvent);
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

    const addRectEvent = new CustomEvent(GroupEventManager.eventName, {
      bubbles: true,
      cancelable: true,
      detail: {
        isGrouping: true,
      },
    });

    GroupEventManager.getInstance().dispatchEvent(addRectEvent);
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
  };
};

const generateDiffAndFlag = (objX, objX2, objY, objY2, clientX, clientY) => {
  const xCollide = objX <= clientX && clientX <= objX2;
  const yCollide = objY < clientY && clientY <= objY2;

  if (xCollide && yCollide) {
    return {
      diffDistance: {
        x: clientX - objX,
        y: clientY - objY,
      },
      flag: fitFlagEnum.fit,
    };
  }

  if (!xCollide && yCollide) {
    const diffDistance = {
      x: objX - clientX,
      y: clientY - objY,
    };
    return {
      diffDistance: diffDistance,
      flag: fitFlagEnum.xFit,
    };
  }

  if (xCollide && !yCollide) {
    const isClientUpper = objY > clientY;
    return {
      diffDistance: {
        x: clientX - objX,
        y: isClientUpper ? objY - clientY : clientY - objY,
      },
      flag: isClientUpper ? fitFlagEnum.upper : fitFlagEnum.lower,
    };
  }

  if (!(xCollide && yCollide)) {
    const isClientOnLeft = objX > clientX;
    const isClientUpper = objY > clientY;
    return {
      diffDistance: {
        x: isClientOnLeft ? objX - clientX : clientX - objX,
        y: isClientUpper ? objY - clientY : clientY - objY,
      },
      flag: isClientUpper
        ? isClientOnLeft
          ? fitFlagEnum.upperLeft
          : fitFlagEnum.upperRight
        : isClientOnLeft
          ? fitFlagEnum.lowerLeft
          : fitFlagEnum.lowerRight,
    };
  }
};
