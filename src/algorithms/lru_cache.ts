/**
 * @file lru_cache.ts
 * @description Least Recently Used (LRU) Cache with O(1) runtime complexity.
 */

class DNode<K, V> {
  constructor(
    public key: K,
    public value: V,
    public prev: DNode<K, V> | null = null,
    public next: DNode<K, V> | null = null
  ) {}
}

export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly map = new Map<K, DNode<K, V>>();
  private readonly head = new DNode<K, V>(null as any, null as any);
  private readonly tail = new DNode<K, V>(null as any, null as any);

  constructor(capacity: number) {
    if (capacity <= 0) throw new Error("Capacity must be positive");
    this.capacity = capacity;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  public get(key: K): V | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;
    this.moveToHead(node);
    return node.value;
  }

  public put(key: K, value: V): void {
    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      this.moveToHead(existing);
      return;
    }

    if (this.map.size >= this.capacity) {
      const evicted = this.removeTail();
      if (evicted) this.map.delete(evicted.key);
    }

    const newNode = new DNode(key, value);
    this.map.set(key, newNode);
    this.addToHead(newNode);
  }

  public size(): number {
    return this.map.size;
  }

  private addToHead(node: DNode<K, V>): void {
    node.prev = this.head;
    node.next = this.head.next;
    if (this.head.next) this.head.next.prev = node;
    this.head.next = node;
  }

  private removeNode(node: DNode<K, V>): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
  }

  private moveToHead(node: DNode<K, V>): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  private removeTail(): DNode<K, V> | null {
    const last = this.tail.prev;
    if (!last || last === this.head) return null;
    this.removeNode(last);
    return last;
  }
}
