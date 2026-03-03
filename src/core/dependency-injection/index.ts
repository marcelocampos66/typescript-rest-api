import { DependencyContainer, container as tsyringeContainer, inject, injectable } from 'tsyringe';
import { DependencyInjection } from '../protocols/dependency-injection';


class DependencyInjectionContainer implements DependencyInjection {
  private readonly dependencyContainer: DependencyContainer = tsyringeContainer;

  public register<T>(dependencyToken: string, dependency: any): void {
    this.dependencyContainer.register<T>(dependencyToken, dependency);
  }

  public registerSingleton<T>(dependencyToken: string, dependency: any): void {
    this.dependencyContainer.registerSingleton<T>(dependencyToken, dependency);
  }

  public getInstance<T>(dependencyToken: string): T {
    return this.dependencyContainer.resolve(dependencyToken);
  }
}

export const container = new DependencyInjectionContainer();

export { injectable, inject };

export * from './modules/core';
export * from './modules/infra';
export * from './modules/domain';
