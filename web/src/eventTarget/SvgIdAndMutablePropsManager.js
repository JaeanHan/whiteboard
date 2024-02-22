export class SvgIdAndMutablePropsManager {
  static instance = null;
  maxIdMap = null;
  commentMap = null;
  startsSizeMap = null;
  srcMap = null;
  updateFlagMap = null;

  // sorted = false;

  constructor() {
    this.maxIdMap = new Map();
    this.commentMap = new Map();
    this.startsSizeMap = new Map();
    this.srcMap = new Map();
    this.updateFlagMap = new Map();
  }

  static getInstance = () => {
    if (!SvgIdAndMutablePropsManager.instance) {
      SvgIdAndMutablePropsManager.instance = new SvgIdAndMutablePropsManager();
    }
    return SvgIdAndMutablePropsManager.instance;
  };

  generateNextId = (svgType) => {
    const currentId = this.maxIdMap.get(svgType) || 0;
    const nextId = currentId + 1;
    this.maxIdMap.set(svgType, nextId);

    const svgId = svgType + nextId;
    console.log("on nextId", svgId);
    this.setIdUpdateFlagMap(svgId);

    return svgId;
  };

  safeSetIdOnLoad = (svgType, id) => {
    const currentId = this.maxIdMap.get(svgType) || 0;
    this.maxIdMap.set(svgType, Math.max(currentId, id));
  };

  // removeId = (sId) => {
  //   this.ids = this.ids.filter((id) => id !== sId);
  // };

  setSizeMap = (id, widthHeight) => {
    this.startsSizeMap.set(id, widthHeight);
    this.setIdUpdateFlagMap(id);
  };
  getSizeById = (id) => this.startsSizeMap.get(id);

  setCommentMap = (id, text, onLoad = false) => {
    this.commentMap.set(id, text);

    if (onLoad) return;

    console.log("on comment change");

    this.setIdUpdateFlagMap(id);
  };
  getCommentById = (id) => this.commentMap.get(id);

  setIdSrcMap = (id, src, onLoad = false) => {
    this.srcMap.set(id, src);

    if (onLoad) return;

    console.log("this?");

    this.setIdUpdateFlagMap(id);
  };
  getSrcById = (id) => this.srcMap.get(id);

  setIdUpdateFlagMap = (id) => {
    this.updateFlagMap.set(id, true);
    console.log(id, this.updateFlagMap, "wtf");
  };
  getUpdateFlagById = (id) => this.updateFlagMap.get(id);
  resetUpdateFlagMap = () => (this.updateFlagMap = new Map());

  // markSorted = () => (this.sorted = true);
}
