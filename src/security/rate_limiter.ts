/**
 * @file rate_limiter.ts
 * @description Token Bucket traffic rate limiting mechanism.
 */

export class TokenBucketRateLimiter {
  private readonly capacity: number;
  private readonly refillRatePerSec: number;
  private tokens: number;
  private lastRefillTimestamp: number;

  constructor(capacity: number, refillRatePerSec: number) {
    if (capacity <= 0 || refillRatePerSec <= 0) {
      throw new Error("Capacity and refill rate must be positive");
    }
    this.capacity = capacity;
    this.refillRatePerSec = refillRatePerSec;
    this.tokens = capacity;
    this.lastRefillTimestamp = Date.now();
  }

  public tryAcquire(requestedTokens = 1): boolean {
    this.refill();
    if (this.tokens >= requestedTokens) {
      this.tokens -= requestedTokens;
      return true;
    }
    return false;
  }

  public getAvailableTokens(): number {
    this.refill();
    return this.tokens;
  }

  private refill(): void {
    const now = Date.now();
    const elapsedSec = (now - this.lastRefillTimestamp) / 1000;
    const addedTokens = elapsedSec * this.refillRatePerSec;
    this.tokens = Math.min(this.capacity, this.tokens + addedTokens);
    this.lastRefillTimestamp = now;
  }
}
