export interface DependencyInjection {
  register(dependencyToken: string, dependency: any): void;

  registerSingleton(dependencyToken: string, dependency: any): void;

  getInstance<T>(dependencyToken: string): T;
}
