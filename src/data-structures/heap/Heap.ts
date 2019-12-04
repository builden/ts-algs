import Comparator from '../../utils/Comparator';

export default class Heap {
  // Array representation of the heap.
  heapContainer: any[] = [];
  compare: any = null;

  constructor(comparatorFunction?: any) {
    if (new.target === Heap) {
      throw new TypeError('Cannot construct Heap instance directly');
    }

    this.compare = new Comparator(comparatorFunction);
  }

  getLeftChildIndex = (parentIndex: number) => 2 * parentIndex + 1;
  getRightChildIndex = (parentIndex: number) => 2 * parentIndex + 2;
  getParentIndex = (childIndex: number) => Math.floor((childIndex - 1) / 2);
  hasParent = (childIndex: number) => this.getParentIndex(childIndex) >= 0;

  hasLeftChild = (parentIndex: number) =>
    this.getLeftChildIndex(parentIndex) < this.heapContainer.length;
  hasRightChild = (parentIndex: number) =>
    this.getRightChildIndex(parentIndex) < this.heapContainer.length;

  leftChild = (parentIndex: number) => this.heapContainer[this.getLeftChildIndex(parentIndex)];
  rightChild = (parentIndex: number) => this.heapContainer[this.getRightChildIndex(parentIndex)];
  parent = (childIndex: number) => this.heapContainer[this.getParentIndex(childIndex)];

  swap(indexOne: number, indexTwo: number) {
    const tmp = this.heapContainer[indexTwo];
    this.heapContainer[indexTwo] = this.heapContainer[indexOne];
    this.heapContainer[indexOne] = tmp;
  }

  peek() {
    if (this.heapContainer.length === 0) return null;
    return this.heapContainer[0];
  }

  poll() {
    if (this.heapContainer.length === 0) return null;
    if (this.heapContainer.length === 1) return this.heapContainer.pop();

    const item = this.heapContainer[0];

    // Move the last element from the end to the head.
    this.heapContainer[0] = this.heapContainer.pop();
    this.heapifyDown();

    return item;
  }

  add(item: any): Heap {
    this.heapContainer.push(item);
    this.heapifyUp();
    return this;
  }

  remove(item: any, comparator = this.compare) {
    // Find number of items to remove.
    const numberOfItemsToRemove = this.find(item, comparator).length;

    for (let iteration = 0; iteration < numberOfItemsToRemove; iteration += 1) {
      // We need to find item index to remove each time after removal since
      // indices are being changed after each heapify process.
      const indexToRemove = this.find(item, comparator).pop() || 0;

      // If we need to remove last child in the heap then just remove it.
      // There is no need to heapify the heap afterwards.
      if (indexToRemove === this.heapContainer.length - 1) {
        this.heapContainer.pop();
      } else {
        // Move last element in heap to the vacant (removed) position.
        this.heapContainer[indexToRemove] = this.heapContainer.pop();

        // Get parent.
        const parentItem = this.parent(indexToRemove);

        // If there is no parent or parent is in correct order with the node
        // we're going to delete then heapify down. Otherwise heapify up.
        if (
          this.hasLeftChild(indexToRemove) &&
          (!parentItem || this.pairIsInCorrectOrder(parentItem, this.heapContainer[indexToRemove]))
        ) {
          this.heapifyDown(indexToRemove);
        } else {
          this.heapifyUp(indexToRemove);
        }
      }
    }

    return this;
  }

  modify(item: any, newItem: any, comparator = this.compare) {
    // Find number of items to modify.
    const modifyItems = this.find(item, comparator);

    if (modifyItems.length > 0) {
      for (let i = 0; i < modifyItems.length; i++) {
        this.heapContainer[modifyItems[i]] = newItem;
      }

      this.buildHeap();
    }

    return this;
  }

  private buildHeap() {
    for (let i = this.getParentIndex(this.heapContainer.length - 1); i >= 0; i--) {
      this.heapifyDown(i);
    }
  }

  find(item: any, comparator = this.compare): number[] {
    const foundItemIndices = [];

    for (let itemIndex = 0; itemIndex < this.heapContainer.length; itemIndex += 1) {
      if (comparator.equal(item, this.heapContainer[itemIndex])) {
        foundItemIndices.push(itemIndex);
      }
    }

    return foundItemIndices;
  }

  isEmpty = () => !this.heapContainer.length;
  toString = () => this.heapContainer.toString();

  heapifyUp(customStartIndex?: number) {
    // Take the last element (last in array or the bottom left in a tree)
    // in the heap container and lift it up until it is in the correct
    // order with respect to its parent element.
    let currentIndex = customStartIndex || this.heapContainer.length - 1;

    while (
      this.hasParent(currentIndex) &&
      !this.pairIsInCorrectOrder(this.parent(currentIndex), this.heapContainer[currentIndex])
    ) {
      this.swap(currentIndex, this.getParentIndex(currentIndex));
      currentIndex = this.getParentIndex(currentIndex);
    }
  }

  /**
   * @param {number} [customStartIndex]
   */
  heapifyDown(customStartIndex = 0) {
    // Compare the parent element to its children and swap parent with the appropriate
    // child (smallest child for MinHeap, largest child for MaxHeap).
    // Do the same for next children after swap.
    let currentIndex = customStartIndex;
    let nextIndex = null;

    while (this.hasLeftChild(currentIndex)) {
      if (
        this.hasRightChild(currentIndex) &&
        this.pairIsInCorrectOrder(this.rightChild(currentIndex), this.leftChild(currentIndex))
      ) {
        nextIndex = this.getRightChildIndex(currentIndex);
      } else {
        nextIndex = this.getLeftChildIndex(currentIndex);
      }

      if (
        this.pairIsInCorrectOrder(this.heapContainer[currentIndex], this.heapContainer[nextIndex])
      ) {
        break;
      }

      this.swap(currentIndex, nextIndex);
      currentIndex = nextIndex;
    }
  }

  /**
   * Checks if pair of heap elements is in correct order.
   * For MinHeap the first element must be always smaller or equal.
   * For MaxHeap the first element must be always bigger or equal.
  /* istanbul ignore next */
  pairIsInCorrectOrder(firstElement: any, secondElement: any): boolean {
    throw new Error(`
      You have to implement heap pair comparision method
      for ${firstElement} and ${secondElement} values.
    `);
  }
}
