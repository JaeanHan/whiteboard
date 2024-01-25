import { eventNameEnum } from "../utils/enums";

export class ThrottlingDebouncingManager extends EventTarget {
  static instance = null;
  static dragEvent = "throttleDrag";
  static scrollEvent = "throttleScroll";
  static moveStarEvent = "throttleMoveStar";
  static multiSelectEvent = "debounceMultiSelect";
  eventThrottleMap = null;
  eventDebounceMap = null;

  constructor() {
    super();
    this.eventThrottleMap = new Map();
    this.eventDebounceMap = new Map();

    this.eventThrottleMap.set(ThrottlingDebouncingManager.dragEvent, false);
    this.eventThrottleMap.set(ThrottlingDebouncingManager.scrollEvent, false);
  }

  static getInstance = () => {
    if (!ThrottlingDebouncingManager.instance) {
      ThrottlingDebouncingManager.instance = new ThrottlingDebouncingManager();
    }
    return ThrottlingDebouncingManager.instance;
  };

  addEventListener = (type, handler) => {
    if (!this.eventThrottleMap.has(type)) {
      super.addEventListener(type, handler);
      this.eventThrottleMap.set(type, handler);
      console.log("registered event", type);
    }
    return this;
  };

  setEventMap = (eventName, isThrottling) => {
    this.eventThrottleMap.set(eventName, isThrottling);
  };

  getEventThrottling = (eventName) => this.eventThrottleMap.get(eventName);

  setDebounceTimer = (eventName, debounceTimer) => {
    this.eventDebounceMap.set(eventName, debounceTimer);
  };

  getDebounceTimer = (eventName) => this.eventDebounceMap.get(eventName);
}
