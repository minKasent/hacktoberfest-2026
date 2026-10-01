/**
 * @file dijkstra.ts
 * @description Single-source shortest path algorithm using an indexed adjacency graph.
 */

export interface Edge {
  to: string;
  weight: number;
}

export class DirectedGraph {
  private readonly adj = new Map<string, Edge[]>();

  public addNode(node: string): void {
    if (!this.adj.has(node)) this.adj.set(node, []);
  }

  public addEdge(from: string, to: string, weight: number): void {
    this.addNode(from);
    this.addNode(to);
    this.adj.get(from)!.push({ to, weight });
  }

  public dijkstra(start: string): { distances: Map<string, number>; previous: Map<string, string | null> } {
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const unvisited = new Set<string>();

    for (const node of this.adj.keys()) {
      distances.set(node, Infinity);
      previous.set(node, null);
      unvisited.add(node);
    }

    distances.set(start, 0);

    while (unvisited.size > 0) {
      let current: string | null = null;
      let minDistance = Infinity;

      for (const node of unvisited) {
        const dist = distances.get(node) ?? Infinity;
        if (dist < minDistance) {
          minDistance = dist;
          current = node;
        }
      }

      if (current === null || minDistance === Infinity) break;
      unvisited.delete(current);

      const neighbors = this.adj.get(current) ?? [];
      for (const edge of neighbors) {
        if (!unvisited.has(edge.to)) continue;
        const candidate = minDistance + edge.weight;
        if (candidate < (distances.get(edge.to) ?? Infinity)) {
          distances.set(edge.to, candidate);
          previous.set(edge.to, current);
        }
      }
    }

    return { distances, previous };
  }
}
