export class ThrottleManager extends EventTarget {
  static instance = null;
  static dragEvent = "throttleDrag";
  static scrollEvent = "throttleScroll";
  registeredEventMap = new Map();
  eventThrottleMap = new Map();

  constructor() {
    super();
    this.eventThrottleMap.set(ThrottleManager.dragEvent, false);
    this.eventThrottleMap.set(ThrottleManager.scrollEvent, false);
  }

  static getInstance = () => {
    if (!ThrottleManager.instance) {
      ThrottleManager.instance = new ThrottleManager();
    }
    return ThrottleManager.instance;
  };

  addEventListener = (type, handler) => {
    if (!this.registeredEventMap.has(type)) {
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
}
