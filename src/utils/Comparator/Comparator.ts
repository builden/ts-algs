export default class Comparator {
  compare = Comparator.defaultCompareFunction;

  constructor(compareFunction?: any) {
    if (compareFunction) this.compare = compareFunction;
  }

  static defaultCompareFunction(a: number | string, b: number | string): number {
    if (a === b) return 0;
    return a < b ? -1 : 1;
  }

  equal = (a: any, b: any): boolean => this.compare(a, b) === 0;
  lessThan = (a: any, b: any): boolean => this.compare(a, b) < 0;
  greaterThan = (a: any, b: any): boolean => this.compare(a, b) > 0;
  lessThanOrEqual = (a: any, b: any): boolean => this.compare(a, b) <= 0;
  greaterThanOrEqual = (a: any, b: any): boolean => this.compare(a, b) >= 0;

  reverse = () => {
    const compareOriginal = this.compare;
    this.compare = (a, b) => compareOriginal(b, a);
  };
}
