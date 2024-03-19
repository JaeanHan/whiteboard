export class MessageQueue {
  static instance = null;
  queue = null;
  head;
  tail;

  constructor() {
    this.queue = [];
    this.head = 0;
    this.tail = 0;
  }

  static getInstance = () => {
    if (!MessageQueue.instance) {
      MessageQueue.instance = new MessageQueue();
    }
    return MessageQueue.instance;
  };

  push = (item) => {
    this.queue = [...this.queue, item];
    this.tail += 1;
  };

  pushLeft = (item) => {
    this.queue = [item, ...this.queue];
    this.tail += 1;
  };

  pop = () => {
    if (this.head >= this.tail) return null;

    this.tail -= 1;
    return this.queue[this.tail];
  };

  popLeft = () => {
    if (this.head >= this.tail) return null;

    const result = this.queue[this.head];
    this.head += 1;
    return result;
  };

  getCurrentQueue = () => [...this.queue.slice(this.head, this.tail + 1)];
}
