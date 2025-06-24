import { FilterQuery, PopulateOption, ProjectionType } from 'mongoose';

export type Identificator = string | number | unknown;

export type Result<T> = T & { id: Identificator, createdAt: Date; updatedAt: Date };

export type Filters<T> = FilterQuery<T>;
export type Populate = PopulateOption;
export type Sort<T> = { [k in keyof T]?: 1 | -1 };

// export type Filters<T> = Record<string, any> | unknown; // Genérico para suportar qualquer estratégia de filtro
// export type Projection<T> = { [K in keyof T]?: boolean } | unknown; // array de campos ou objeto
// export type Populate = string | string[] | Record<string, unknown> | unknown; // genérico, depende do banco
// export type Sort<T> = { [K in keyof T]?: 'asc' | 'desc' | 1 | -1 };

export type Page<T> = {
  docs: T[];
  total: number;
};

export type PageRequest = {
  page: number;
  size: number;
};

export type FindByKey<T> = {
  id: Identificator
  options?: {
    populate?: Populate;
    select?: ProjectionType<T>;
    withDeleted?: boolean;
  },
}

export type Find<T> = {
  filters?: Filters<T>;
  populate?: Populate;
  select?: ProjectionType<T>;
  sort?: Sort<T>;
  withDeleted?: boolean;
};

export type FindPaginated<T> = Find<T> & PageRequest;

export interface FindByIdRepository<T> {
  findById(
    id: Identificator,
    options?: {
      populate?: Populate;
      select?: ProjectionType<T>;
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
      select?: ProjectionType<T>;
      withDeleted?: boolean;
    }
  ): Promise<Result<T>>;
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
