export class SvgIdAndMutablePropsManager {
  static instance = null;
  maxIdMap = null;
  commentMap = null;
  starsPosMap = null;
  srcMap = null;
  updateFlagMap = null;

  // sorted = false;

  constructor() {
    this.maxIdMap = new Map();
    this.commentMap = new Map();
    this.starsPosMap = new Map();
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
    // console.log("on nextId", svgId);
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

  setStarsPosMapOnLoad = (id, stars) => {
    this.starsPosMap.set(id, stars);
  };
  setStarsPosMap = (id, stars) => {
    this.starsPosMap.set(id, stars);
    this.setIdUpdateFlagMap(id);
  };
  getStarsPosById = (id) => this.starsPosMap.get(id);

  setCommentMapOnLoad = (id, text) => {
    this.commentMap.set(id, text);
  };
  setCommentMap = (id, text) => {
    this.commentMap.set(id, text);
    this.setIdUpdateFlagMap(id);
  };
  getCommentById = (id) => this.commentMap.get(id);

  setIdSrcMapOnLoad = (id, src) => {
    this.srcMap.set(id, src);
  };
  setIdSrcMap = (id, src) => {
    this.srcMap.set(id, src);
    this.setIdUpdateFlagMap(id);
  };
  getSrcById = (id) => this.srcMap.get(id);

  setIdUpdateFlagMap = (id) => this.updateFlagMap.set(id, true);
  setIdUpdateFlagMapOff = (id) => this.updateFlagMap.set(id, false);
  getUpdateFlagById = (id) => this.updateFlagMap.get(id);
  resetUpdateFlagMap = () => (this.updateFlagMap = new Map());

  // markSorted = () => (this.sorted = true);
}
