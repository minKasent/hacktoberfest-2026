/**
 * @file bloom_filter.ts
 * @description Space-efficient probabilistic Bloom Filter data structure.
 */

export class BloomFilter {
  private readonly size: number;
  private readonly hashCount: number;
  private readonly bitArray: Uint8Array;

  constructor(expectedItems: number, falsePositiveRate: number) {
    this.size = Math.ceil(-((expectedItems * Math.log(falsePositiveRate)) / (Math.log(2) ** 2)));
    this.hashCount = Math.round((this.size / expectedItems) * Math.log(2));
    this.bitArray = new Uint8Array(Math.ceil(this.size / 8));
  }

  public add(item: string): void {
    const hashes = this.getHashes(item);
    for (const hash of hashes) {
      const bitIndex = hash % this.size;
      const byteIndex = Math.floor(bitIndex / 8);
      const offset = bitIndex % 8;
      this.bitArray[byteIndex] |= 1 << offset;
    }
  }

  public test(item: string): boolean {
    const hashes = this.getHashes(item);
    for (const hash of hashes) {
      const bitIndex = hash % this.size;
      const byteIndex = Math.floor(bitIndex / 8);
      const offset = bitIndex % 8;
      if ((this.bitArray[byteIndex] & (1 << offset)) === 0) {
        return false;
      }
    }
    return true;
  }

  private getHashes(str: string): number[] {
    let h1 = 0x811c9dc5;
    let h2 = 0x27d4eb2f;

    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ code, 0x01000193);
      h2 = Math.imul(h2 ^ code, 0x000001b3);
    }

    const results: number[] = [];
    for (let i = 0; i < this.hashCount; i++) {
      results.push(Math.abs((h1 + i * h2) >>> 0));
    }
    return results;
  }
}
