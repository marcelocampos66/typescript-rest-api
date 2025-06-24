import { AsyncLocalStorage } from 'async_hooks';

class ContextStorage<T = unknown> {
  private readonly storage: AsyncLocalStorage<T> = new AsyncLocalStorage();

  public async store(state: T, callback?: () => void | Promise<void>): Promise<void> {
    return this.storage.run(state, callback);
  }

  public getStore(): unknown | undefined {
    return this.storage.getStore();
  }
}

export default new ContextStorage();
