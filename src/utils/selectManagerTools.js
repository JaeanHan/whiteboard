import { arrowKeysEnum, fitFlagEnum } from "./enums";
import {
  GroupEventManager,
  GroupKeyMapKey,
} from "../eventTarget/GroupEventManager";

export const generateDiffAndFlag = (
  objX,
  objX2,
  objY,
  objY2,
  clientX,
  clientY,
) => {
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

export const calcFit = (client, distance) => {
  return {
    x: client.x - distance.x,
    y: client.y - distance.y,
  };
};
export const calcXFit = (client, distance) => {
  return {
    x: client.x + distance.x,
    y: client.y - distance.y,
  };
};
export const calcUpper = (client, distance) => {
  return {
    x: client.x - distance.x,
    y: client.y + distance.y,
  };
};
export const calcLower = (client, distance) => {
  return {
    x: client.x - distance.x,
    y: client.y - distance.y,
  };
};
export const calcUpperLeft = (client, distance) => {
  return {
    x: client.x + distance.x,
    y: client.y + distance.y,
  };
};
export const calcUpperRight = (client, distance) => {
  return {
    x: client.x - distance.x,
    y: client.y + distance.y,
  };
};
export const calcLowerLeft = (client, distance) => {
  return {
    x: client.x + distance.x,
    y: client.y - distance.y,
  };
};
export const calcLowerRight = (client, distance) => {
  return {
    x: client.x - distance.x,
    y: client.y - distance.y,
  };
};

export const calcPosOnDrag = (flag, dragPos, diffDistance) => {
  if (flag === fitFlagEnum.fit) {
    return {
      x: dragPos.x - diffDistance.x,
      y: dragPos.y - diffDistance.y,
    };
  }

  if (flag === fitFlagEnum.xFit) {
    return {
      x: dragPos.x + diffDistance.x,
      y: dragPos.y - diffDistance.y,
    };
  }

  if (flag === fitFlagEnum.upper) {
    return {
      x: dragPos.x - diffDistance.x,
      y: dragPos.y + diffDistance.y,
    };
  }

  if (flag === fitFlagEnum.lower) {
    return {
      x: dragPos.x - diffDistance.x,
      y: dragPos.y - diffDistance.y,
    };
  }

  if (flag === fitFlagEnum.upperLeft) {
    return {
      x: dragPos.x + diffDistance.x,
      y: dragPos.y + diffDistance.y,
    };
  }

  if (flag === fitFlagEnum.upperRight) {
    return {
      x: dragPos.x - diffDistance.x,
      y: dragPos.y + diffDistance.y,
    };
  }

  if (flag === fitFlagEnum.lowerLeft) {
    return {
      x: dragPos.x + diffDistance.x,
      y: dragPos.y - diffDistance.y,
    };
  }

  if (flag === fitFlagEnum.lowerRight) {
    return {
      x: dragPos.x - diffDistance.x,
      y: dragPos.y - diffDistance.y,
    };
  }

  console.error("something not handled", flag, dragPos, diffDistance);
  return { x: 0, y: 0 };
};

export const setMoveMapByKey = (flag) => {
  const GEM = GroupEventManager.getInstance();
  const GKM = GEM.getGroupKeyMoveMap();
  const speed = GEM.getKeyMoveSpeed();

  const previousX = GKM.get(GroupKeyMapKey.x);
  const previousY = GKM.get(GroupKeyMapKey.y);

  if (flag === arrowKeysEnum.left) {
    const currentX = previousX - speed;
    GKM.set(GroupKeyMapKey.x, currentX);
    return;
  }

  if (flag === arrowKeysEnum.right) {
    const currentX = previousX + speed;
    GKM.set(GroupKeyMapKey.x, currentX);
    return;
  }

  if (flag === arrowKeysEnum.up) {
    const currentY = previousY - speed;
    GKM.set(GroupKeyMapKey.y, currentY);
    return;
  }

  if (flag === arrowKeysEnum.down) {
    const currentY = previousY + speed;
    GKM.set(GroupKeyMapKey.y, currentY);
  }
};

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
