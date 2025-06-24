export interface Factory<T extends abstract new (...args: any) => any> {
  getInstance: (...args: any) => InstanceType<T>;
}
