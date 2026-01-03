export type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

export class SimpleCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private ttl: number;

  constructor(ttl: number) {
    this.ttl = ttl;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (entry && Date.now() - entry.timestamp < this.ttl) {
      return entry.data;
    }

    if (entry) {
      this.cache.delete(key);
    }

    return undefined;
  }

  set(key: string, value: T) {
    this.cache.set(key, { data: value, timestamp: Date.now() });
  }

  delete(key: string) {
    this.cache.delete(key);
  }
}
