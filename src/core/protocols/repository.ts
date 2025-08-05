import { Identificator, Entity } from "./entity";

// export type Result<T> = T & { id: Identificator, createdAt: Date; updatedAt: Date };
export type Result<T> = T & Entity;

export type Filters<T> = { [K in keyof T]?: unknown } | unknown;

export type Projection<T> = { [K in keyof T]?: boolean } | unknown;

export type Populate =  unknown;

export type Sort<T> = { [K in keyof T]?: 'asc' | 'desc' | 1 | -1 | 'ascending' | 'descending' };

export type Page<T> = {
  data: T[];
  _pagination: {
    total: number;
    page: number;
    limit: number;
  };
};

export type PageRequest = {
  page: number;
  size: number;
};

export type FindByKey<T> = {
  id: Identificator
  options?: {
    populate?: Populate;
    select?: Projection<T>;
    withDeleted?: boolean;
  },
}

export type Find<T> = {
  filters?: Filters<T>;
  populate?: Populate;
  select?: Projection<T>;
  sort?: Sort<T>;
  withDeleted?: boolean;
};

export type FindPaginated<T> = Find<T> & PageRequest;

export interface FindByIdRepository<T> {
  findById(
    id: Identificator,
    options?: {
      populate?: Populate;
      select?: Projection<T>;
      withDeleted?: boolean;
    }
  ): Promise<Result<T> | null>;
}

export interface ListRepository<T> {
  list(args?: Find<T>): Promise<Result<T>[]>;
}

export interface PaginateRepository<T> {
  paginate(findPaginated: FindPaginated<T>): Promise<Page<Result<T>>>;
}

export interface FindOneRepository<T> {
  findOne(args?: Find<T>): Promise<Result<T> | null>;
}

export interface CreateRepository<T> {
  create(props: T): Promise<Result<T>>;
}

export interface CreateManyRepository<T> {
  createMany(props: T[]): Promise<Result<T>[]>;
}

export interface UpdateRepository<T> {
  update(
    id: Identificator,
    props: Partial<T>,
    options?: {
      populate?: Populate;
      select?: Projection<T>;
      withDeleted?: boolean;
    }
  ): Promise<Entity>;
}

export interface DisableRepository<T> {
  disable(id: Identificator): Promise<Result<T> | null>;
}

export interface RestoreRepository<T> {
  restore(id: Identificator): Promise<Result<T> | null>;
}

export interface DeleteRepository<T> {
  delete(id: Identificator): Promise<Result<T> | null>;
}
