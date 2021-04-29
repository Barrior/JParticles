class Cache {
  store: Map<any, any>

  constructor() {
    this.store = new Map()
  }

  has(key: any): boolean {
    return this.store.has(key)
  }

  set(key: any, value: any): void {
    this.store.set(key, value)
  }

  get<T extends any>(key: any): T {
    return this.store.get(key)
  }
}

export default Cache
