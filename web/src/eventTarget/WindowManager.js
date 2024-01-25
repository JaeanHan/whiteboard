import { sideBarWidth } from "../components/SideBar";
import { bannerHeight } from "../components/Banner";

export class WindowManager {
  static instance = null;

  windowSize;
  unnamedWindow;
  selectedWindow;

  windowActualVirtualMap = null;
  nonUniqueNameIndexMap = null;

  constructor() {
    this.windowActualVirtualMap = new Map();
    this.nonUniqueNameIndexMap = new Map();

    this.windowSize = [0, 0];
    this.unnamedWindow = "Welcome";
    this.selectedWindow = `${this.unnamedWindow} 1`;
    this.windowActualVirtualMap.set(this.selectedWindow, this.selectedWindow);
  }

  static getInstance = () => {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  };

  addWindow = (windowName) => {
    if (this.windowActualVirtualMap.has(windowName)) {
      let i = 2;

      while (1) {
        const newTempName = windowName + i;
        if (!this.windowActualVirtualMap.has(newTempName)) break;
        i++;
      }

      const realName = windowName + i;
      const nameAndViewIndexMapping =
        windowName + this.windowActualVirtualMap.size;

      this.nonUniqueNameIndexMap.set(nameAndViewIndexMapping, realName);

      this.windowActualVirtualMap.set(realName, windowName);
      this.selectedWindow = realName;

      return;
    }

    this.windowActualVirtualMap.set(windowName, windowName);
    this.selectedWindow = windowName;
  };

  getRealName = (currentName, viewIndex) => {
    const nameAndViewIndexMapping = currentName + viewIndex;
    return (
      this.nonUniqueNameIndexMap.get(nameAndViewIndexMapping) ?? currentName
    );
  };

  getVirtualName = (realName) => {
    return this.windowActualVirtualMap.get(realName);
  };

  setSelectedWindow = (currentName, viewIndex) => {
    const realName = this.getRealName(currentName, viewIndex);

    console.log("on select real name", realName);
    this.selectedWindow = realName;
  };

  getSelectedVirtualWindow = () => {
    return this.getVirtualName(this.selectedWindow);
  };

  changeWindowVirtualName = (currentName, viewIndex, newName) => {
    const realName = this.getRealName(currentName, viewIndex);

    this.windowActualVirtualMap.set(realName, newName);
  };

  getVirtualWindows = () => {
    const virtualWindows = [];

    for (const [key, value] of this.windowActualVirtualMap) {
      virtualWindows.push(value);
    }

    return virtualWindows;
  };

  getUnnamedWindowNameOnAdd = () =>
    `${this.unnamedWindow} ${this.windowActualVirtualMap.length + 1}`;

  setWindowSize = (array) => (this.windowSize = array);

  getWindowBounding = () => {
    return [
      [window.scrollX, window.scrollY],
      [window.innerWidth - sideBarWidth, window.innerHeight - bannerHeight],
    ];
  };
}
