import { sideBarWidth } from "../components/SideBar";
import { bannerHeight } from "../components/Tabs";

export class WindowManager {
  static instance = null;

  windowSize;
  unnamedWindow;
  selectedWindow;

  windowRealVirtualNameMap = null;
  nonUniqueNameIndexMap = null;
  bannerWindowHandler = () => {};

  constructor() {
    this.windowRealVirtualNameMap = new Map();
    this.nonUniqueNameIndexMap = new Map();

    this.windowSize = [0, 0];
    this.unnamedWindow = "Welcome";
    this.init();
  }

  static getInstance = () => {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  };

  init = () => {
    // console.log("wm init!");
    this.selectedWindow = `${this.unnamedWindow} 1`;
    this.windowRealVirtualNameMap.set(this.selectedWindow, this.selectedWindow);
  };

  addWindow = (givenName) => {
    if (!givenName) return;

    const windowName = givenName.trim();

    if (this.windowRealVirtualNameMap.has(windowName)) {
      let i = 2;

      while (1) {
        const newTempName = windowName + i;
        if (!this.windowRealVirtualNameMap.has(newTempName)) break;
        i++;
      }

      const realName = windowName + i;
      const nameAndViewIndexMapping =
        windowName + this.windowRealVirtualNameMap.size;

      // console.log("???", nameAndViewIndexMapping, realName);

      this.nonUniqueNameIndexMap.set(nameAndViewIndexMapping, realName);

      this.windowRealVirtualNameMap.set(realName, windowName);
      this.selectedWindow = realName;

      return;
    }

    this.windowRealVirtualNameMap.set(windowName, windowName);
    this.selectedWindow = windowName;
  };

  deleteWindow = (virtualName, viewIndex) => {
    const realName = this.getRealName(virtualName, viewIndex);

    this.windowRealVirtualNameMap.delete(realName);
    // this.nonUniqueNameIndexMap.delete(realName);

    // console.log("delete", virtualName, "at", viewIndex);
    console.log(this.windowRealVirtualNameMap);
  };

  getRealName = (virtualName, viewIndex) => {
    const nameAndViewIndexMapping = virtualName + viewIndex;
    return (
      this.nonUniqueNameIndexMap.get(nameAndViewIndexMapping) ?? virtualName
    );
  };

  getVirtualName = (realName) => {
    return this.windowRealVirtualNameMap.get(realName);
  };

  setSelectedWindow = (virtualName, viewIndex) => {
    const realName = this.getRealName(virtualName, viewIndex);

    console.log("on select real name", realName);
    this.selectedWindow = realName;
  };

  getSelectedWindow = () => {
    // return btoa(this.selectedWindow);
    return this.selectedWindow;
  };

  getSelectedVirtualWindow = () => {
    return this.getVirtualName(this.selectedWindow);
  };

  changeWindowVirtualName = (virtualName, viewIndex, newName) => {
    const realName = this.getRealName(virtualName, viewIndex);
    console.log("realName", realName);
    console.log("newName", newName);

    this.windowRealVirtualNameMap.set(realName, newName);
  };

  getVirtualWindows = () => {
    const virtualWindows = [];

    for (const [key, value] of this.windowRealVirtualNameMap) {
      virtualWindows.push(value);
    }

    console.log("selected", virtualWindows);

    return virtualWindows;
  };

  getUnnamedWindowNameOnAdd = () =>
    `${this.unnamedWindow} ${this.windowRealVirtualNameMap.size + 1}`;

  setBannerWindowHandler = (handler) => (this.bannerWindowHandler = handler);
  bannerAddOnLoad = (newWindow) => {
    if (this.windowRealVirtualNameMap.has(newWindow)) return;

    this.bannerWindowHandler((prev) => [...prev, newWindow]);
    this.windowRealVirtualNameMap.set(newWindow, newWindow);
  };

  setWindowSize = (array) => (this.windowSize = array);

  getWindowBounding = () => {
    return [
      [window.scrollX, window.scrollY],
      [window.innerWidth - sideBarWidth, window.innerHeight - bannerHeight],
    ];
  };
}
