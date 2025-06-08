class Stack {
  constructor() {
    this.data = [];
  }
  push(x) {
    this.data.push(x);
  }
  pop() {
    return this.data.pop();
  }
  peek() {
    return this.data[this.data.length - 1];
  }
  isEmpty() {
    return this.data.length === 0;
  }
}

class Queue {
  constructor() {
    this.data = [];
  }
  enqueue(x) {
    this.data.push(x);
  }
  dequeue() {
    return this.data.shift();
  }
  front() {
    return this.data[0];
  }
  isEmpty() {
    return this.data.length === 0;
  }
}

// Demo usage
const s = new Stack();
s.push(10);
s.push(20);
console.log("Stack Pop:", s.pop());  // Output: 20

const q = new Queue();
q.enqueue(1);
q.enqueue(2);
console.log("Queue Dequeue:", q.dequeue());  // Output: 1
