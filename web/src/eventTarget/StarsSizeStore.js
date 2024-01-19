export class StarsSizeStore extends EventTarget {
  static instance = null;
  startsSizeMap = new Map();

  constructor() {
    super();
  }

  static getInstance = () => {
    if (!StarsSizeStore.instance) {
      StarsSizeStore.instance = new StarsSizeStore();
    }
    return StarsSizeStore.instance;
  };

  setSizeMap = (id, widthHeight) => {
    this.startsSizeMap.set(id, widthHeight);
  };

  getSizeById = (id) => this.startsSizeMap.get(id);
}
