export class SvgIdAndMutablePropsManager {
  static instance = null;
  idMap = null;
  textMap = null;
  startsSizeMap = null;
  sorted = false;

  constructor() {
    this.idMap = new Map();
    this.textMap = new Map();
    this.startsSizeMap = new Map();
  }

  static getInstance = () => {
    if (!SvgIdAndMutablePropsManager.instance) {
      SvgIdAndMutablePropsManager.instance = new SvgIdAndMutablePropsManager();
    }
    return SvgIdAndMutablePropsManager.instance;
  };

  generateNextId = (svgType) => {
    const currentId = this.idMap.get(svgType) || 0;
    const nextId = currentId + 1;
    this.idMap.set(svgType, nextId);
    return nextId;
  };

  safeSetId = (svgType, id) => {
    const currentId = this.idMap.get(svgType) || 0;
    this.idMap.set(svgType, Math.max(currentId, id));
  };

  // removeId = (sId) => {
  //   this.ids = this.ids.filter((id) => id !== sId);
  // };

  setSizeMap = (id, widthHeight) => this.startsSizeMap.set(id, widthHeight);
  getSizeById = (id) => this.startsSizeMap.get(id);

  setTextMap = (id, text) => this.textMap.set(id, text);
  getTextById = (id) => this.textMap.get(id);

  markSorted = () => (this.sorted = true);
}
