export class ActionQueue {
  constructor(size = 100) {
    this.queue = new Array(size);
    this.size = size;
    this.head = 0;
    this.tail = 0;
  }

  isFull() {
    return (this.tail + 1) % this.size === this.head;
  }

  isEmpty() {
    return this.head === this.tail;
  }

  enqueue(action) {
    if (this.isFull()) {
      console.error("ActionQueue is full");
      return false;
    }
    this.queue[this.tail] = action;
    this.tail = (this.tail + 1) % this.size;
    return true;
  }

  dequeue() {
    if (this.isEmpty()) return null;

    const action = this.queue[this.head];
    this.queue[this.head] = undefined; // optional cleanup
    this.head = (this.head + 1) % this.size;

    return action;
  }

  processAll(context) {
    while (!this.isEmpty()) {
      const action = this.dequeue();
      action.execute(context);
    }
  }
}

