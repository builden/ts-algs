export default class LinkedListNode {
  constructor(public value: any, public next: LinkedListNode | null = null) {}

  toString(callback?: Function) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
