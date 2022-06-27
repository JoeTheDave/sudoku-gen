import gen from 'random-seed';

export class Random {
  private generator: any;

  constructor(seed: string) {
    this.generator = gen.create(seed);
  }

  range(min: number, max: number) {
    return this.generator(max - min + 1) + min;
  }

  randomSelection<T>(list: T[]) {
    return list[this.range(0, list.length - 1)];
  }
}
