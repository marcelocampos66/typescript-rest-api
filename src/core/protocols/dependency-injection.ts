export interface DependencyInjection {
  register(dependencyToken: string, dependency: any): void;

  registerSingleton(dependencyToken: string, dependency: any): void;

  getInstance<T>(dependencyToken: string): T;
}

// type Constructor<T> = new (...args: any[]) => T;

// type InjectableDecorator = <T>(target: Constructor<T>) => void | Function;

// type InjectDecorator = <T>(target: Constructor<T>) => void | Function;
