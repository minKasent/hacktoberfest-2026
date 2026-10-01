/**
 * @file async_queue.ts
 * @description Priority-bounded asynchronous worker queue with concurrency limits.
 */

export type Task<T> = () => Promise<T>;

export class AsyncWorkerQueue {
  private activeCount = 0;
  private readonly queue: Array<() => void> = [];

  constructor(public readonly maxConcurrency: number) {
    if (maxConcurrency <= 0) throw new Error("Concurrency must be greater than zero");
  }

  public async add<T>(task: Task<T>): Promise<T> {
    if (this.activeCount >= this.maxConcurrency) {
      await new Promise<void>((resolve) => this.queue.push(resolve));
    }

    this.activeCount++;
    try {
      return await task();
    } finally {
      this.activeCount--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        next?.();
      }
    }
  }

  public get pending(): number {
    return this.queue.length;
  }

  public get active(): number {
    return this.activeCount;
  }
}
