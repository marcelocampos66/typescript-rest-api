import { Identificator } from './entity';
import { Find, FindPaginated, Page, Populate, Result, Projection } from './repository';

export interface FindByIdService<T> {
  findById(
    id: Identificator,
    options?: {
      populate?: Populate;
      select?: Projection<T>;
      withDeleted?: boolean;
    },
  ): Promise<Result<T> | null>;
}

export interface ListService<T> {
  list(args?: Find<T>): Promise<Result<T>[]>;
}

export interface PaginateService<T> {
  paginate(findPaginated: FindPaginated<T>): Promise<Page<Result<T>>>;
}

export interface FindOneService<T> {
  findOne(args?: Find<T>): Promise<Result<T> | null>;
}

export interface CreateService<T> {
  create(props: T): Promise<Result<T>>;
}

export interface UpdateService<T> {
  update(
    id: Identificator,
    props: Partial<T>,
    options?: {
      populate?: Populate;
      select?: Projection<T>;
      withDeleted?: boolean;
    }
  ): Promise<Result<T>>;
}

export interface DisableService<T> {
  disable(id: Identificator): Promise<Result<T> | null>;
}

export interface RestoreService<T> {
  restore(id: Identificator): Promise<Result<T> | null>;
}

export interface DeleteService<T> {
  delete(id: Identificator): Promise<Result<T> | null>;
}
