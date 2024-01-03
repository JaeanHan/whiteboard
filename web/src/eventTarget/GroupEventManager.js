import { groupingStateEnum } from "../utils/enums";

export class GroupEventManager extends EventTarget {
  static instance = null;
  static eventName = "groupingEvent";
  registeredEventMap = new Map();
  isGrouping = groupingStateEnum.none;
  constructor() {
    super();
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
}
