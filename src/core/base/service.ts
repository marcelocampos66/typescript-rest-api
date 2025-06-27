import { Find, FindByIdRepository, FindPaginated, Page, Populate, Result, Projection } from '../protocols/repository';
import { FindByIdService, ListService, PaginateService, FindOneService, CreateService, UpdateService, DisableService, RestoreService, DeleteService } from '../protocols/service';
import { Identificator } from '../protocols';

type Repository<T> = FindByIdRepository<T> 
  & ListService<T> 
  & PaginateService<T> 
  & FindOneService<T> 
  & CreateService<T> 
  & UpdateService<T> 
  & DisableService<T>
  & RestoreService<T>
  & DeleteService<T>;

export class Service<T> implements FindByIdService<T>, ListService<T>, PaginateService<T>, FindOneService<T>, CreateService<T>, UpdateService<T>, DisableService<T>, RestoreService<T>, DeleteService<T> {
  constructor(protected repository: Repository<T>) {}

  async findById(id: Identificator, options?: { populate?: Populate; select?: Projection<T>; withDeleted?: boolean; }): Promise<Result<T>> {
    return this.repository.findById(id, options);
  }

  async list(args?: Find<T>): Promise<Result<T>[]> {
    return this.repository.list(args);
  }

  async paginate(args: FindPaginated<T>): Promise<Page<Result<T>>> {
    return this.repository.paginate(args);
  }

  async findOne(args?: Find<T>): Promise<Result<T>> {
    return this.repository.findOne(args);
  }

  async create(props: T): Promise<Result<T>> {
    return this.repository.create(props);
  }

  async update(id: Identificator, props: Partial<T>, options?: { populate?: Populate; select?: Projection<T>; withDeleted?: boolean; }): Promise<Result<T>> {
    return this.repository.update(id, props, options)
  }

  async disable(id: Identificator): Promise<Result<T>> {
    return this.repository.disable(id);
  }

  async restore(id: Identificator): Promise<Result<T>> {
    return this.repository.restore(id);
  }

  async delete(id: Identificator): Promise<Result<T>> {
    return this.repository.delete(id);
  }
}
