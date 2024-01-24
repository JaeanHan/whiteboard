import { sideBarWidth } from "../components/SideBar";
import { bannerHeight } from "../components/Banner";

export class WindowManager {
  static instance = null;
  windows;
  selectedWindow;
  windowSize;

  constructor() {
    this.windows = [];
    this.selectedWindow = 0;
    this.windowSize = [0, 0];
  }

  static getInstance = () => {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  };

  addWindow = (windowName) => this.windows.push(windowName);
  deleteWindow = (windowName) =>
    (this.windows = this.windows.filter((name) => name !== windowName));
  getCurrentWindow = () => this.windows[this.selectedWindow];

  setSelectedWindowIndex = (i) => {
    console.log("index set to", i);
    this.selectedWindow = i;
  };

  setWindowSize = (array) => (this.windowSize = array);

  getWindowBounding = () => {
    return {
      x: window.scrollX,
      y: window.scrollY,
      width: window.innerWidth - sideBarWidth,
      height: window.innerHeight - bannerHeight,
    };
  };
}
