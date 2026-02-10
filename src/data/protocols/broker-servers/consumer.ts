export interface Consumer {
  consume(payload: unknown): Promise<void>;
  
  register (): Promise<void>;
}
