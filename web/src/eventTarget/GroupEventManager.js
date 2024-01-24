import { groupingStateEnum } from "../utils/enums";

export const GroupKeyMapKey = {
  x: "GX",
  y: "GY",
};

export class GroupEventManager extends EventTarget {
  static instance = null;
  static eventName = "groupingEvent";
  registeredEventMap = new Map();
  groupKeyMoveMap = new Map();
  isGrouping = groupingStateEnum.none;
  keyMoveSpeed = 1;
  speedLimit = 5;

  constructor() {
    super();
    this.resetGroupKeyMoveMap();
  }

  static getInstance = () => {
    if (!GroupEventManager.instance) {
      GroupEventManager.instance = new GroupEventManager();
    }
    return GroupEventManager.instance;
  };

  addEventListener = (type, handler) => {
    if (!this.registeredEventMap.has(type)) {
      super.addEventListener(type, handler);
      this.registeredEventMap.set(type, handler);
      console.log("registered event", type);
    }
  };

  getGroupingState = () => this.isGrouping;
  setGroupingState = (currentState) => {
    this.isGrouping = currentState;
  };

  getGroupKeyMoveMap = () => this.groupKeyMoveMap;
  resetGroupKeyMoveMap = () => {
    this.groupKeyMoveMap.set(GroupKeyMapKey.x, 0);
    this.groupKeyMoveMap.set(GroupKeyMapKey.y, 0);
  };

  getKeyMoveSpeed = () => this.keyMoveSpeed;
  goFaster = () => {
    if (this.keyMoveSpeed <= this.speedLimit) {
      this.keyMoveSpeed += 1;
      console.log("gem", this.keyMoveSpeed);
    }
  };
  settleDown = () => {
    this.keyMoveSpeed = 1;
  };
}
