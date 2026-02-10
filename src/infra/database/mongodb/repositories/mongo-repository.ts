import { Model, ProjectionType, ClientSession, Types, FilterQuery, PopulateOptions } from 'mongoose';
import {
  Find,
  CreateRepository,
  FindOneRepository,
  Result,
  FindByIdRepository,
  ListRepository,
  PaginateRepository,
  FindPaginated,
  Page,
  UpdateRepository,
  DeleteRepository,
  DisableRepository,
  RestoreRepository,
} from '../../../../core/protocols/repository';
import { Identificator } from 'src/core/protocols/entity';
import contextStorage from '../../../../core/context/context-storage';

export type MongoFilterQuery<T> = FilterQuery<T>;
export type MongoPopulate = string | string[] | PopulateOptions | PopulateOptions[];
export type MongoProjection<T> = ProjectionType<T>;
export type MongoResult<T> = T & { _id: Types.ObjectId, __v: number, createdAt: Date; updatedAt: Date };

class MongoBaseRepositoryHelpers {
  static formatDocument<T>(document: MongoResult<T>): Result<T> {
    if (!document) return;
    const { _id, __v, ...documentData } = document;

    return {
      ...documentData,
      id: _id,
    } as Result<T>
  }
}

export class MongoRepository<T> implements FindByIdRepository<T>, ListRepository<T>, PaginateRepository<T>, FindOneRepository<T>, CreateRepository<T>, UpdateRepository<T>, DisableRepository<T>, RestoreRepository<T>, DeleteRepository<T> {
  constructor(protected model: Model<T>) {}

  async findById(id: Identificator, options?: { populate?: MongoPopulate; select?: MongoProjection<T>; withDeleted?: boolean; }): Promise<Result<T>> {
    const store = contextStorage.getStore() as { session?: ClientSession };

    const document = await <Promise<MongoResult<T> | null>>this.model
      .findOne(
        {
          _id: id,
          deleted: {
            $in: [null, false, options?.withDeleted],
          },
        },
        options?.select,
        {
          session: store?.session || null,
          populate: options?.populate,
        },
      )
      .lean()
      .exec();

    return MongoBaseRepositoryHelpers.formatDocument<T>(document);
  }

  async list({ filters, populate, select, sort, withDeleted }: Find<T> = {}): Promise<Result<T>[]> {
    const store = contextStorage.getStore() as { session?: ClientSession };
    const populateProps = populate as MongoPopulate;
    const filtersProps = filters as MongoFilterQuery<T>;

    const documentList = await <Promise<Result<T>[]>><unknown>this.model
      .find(
        {
          deleted: {
            $in: [null, false, withDeleted],
          },
          ...filtersProps,
        },
        select,
        {
          session: store?.session || null,
          populate: populateProps,
          sort: sort || { _id: -1 },
        }
      )
      .lean()
      .exec();

    return documentList.map(MongoBaseRepositoryHelpers.formatDocument);
  }

  async paginate({
    filters,
    size,
    page,
    sort,
    populate,
    withDeleted = false,
    select,
  }: FindPaginated<T>): Promise<Page<Result<T>>> {
    const store = contextStorage.getStore() as { session?: ClientSession };
    const filtersProps = filters as MongoFilterQuery<T>;
    const populateProps = populate as MongoPopulate;

    const [docs, total] = await Promise.all([
      this.model
        .find({
          deleted: {
            $in: [null, false, withDeleted],
          },
          ...filtersProps,
        })
        .setOptions({
          session: store?.session || null,
          populate: populateProps,
          sort: sort || { _id: -1 },
          projection: select,
          limit: size,
          skip: (page - 1) * size,
        })
        .lean()
        .exec(),
      this.model
        .countDocuments({
          deleted: {
            $in: [null, false, withDeleted],
          },
          ...filtersProps,
        })
        .exec(),
    ]);

    return {
      data: <Result<T>[]>docs.map(MongoBaseRepositoryHelpers.formatDocument),
      _pagination: {
        total: Number(total),
        page: Number(page),
        limit: Number(size),
      },
    };
  }

  async findOne({ filters, populate, select, sort, withDeleted }: Find<T> = {}): Promise<Result<T> | null> {
    const store = contextStorage.getStore() as { session?: ClientSession };
    const populateProps = populate as MongoPopulate;
    const filtersProps = filters as MongoFilterQuery<T>;
    
    const document = await <Promise<MongoResult<T> | null>>this.model
      .findOne(
        {
          deleted: {
            $in: [null, false, withDeleted],
          },
          ...filtersProps,
        },
        select,
        {
          session: store?.session || null,
          populate: populateProps,
          sort: sort || { _id: -1 },
        }
      )
      .lean()
      .exec();

    return MongoBaseRepositoryHelpers.formatDocument<T>(document);
  }

  async create(props: T): Promise<Result<T>>  {
    const store = contextStorage.getStore() as { session?: ClientSession };

    const [document] = await this.model.create([props], {
      session: store?.session || null,
    });

    const mongoDocument: MongoResult<T> = document.toObject();

    return MongoBaseRepositoryHelpers.formatDocument<T>(mongoDocument);
  }

  async update(id: Identificator, props: Partial<T>, options?: { populate?: MongoPopulate; select?: MongoProjection<T>; withDeleted?: boolean; }): Promise<Result<T>> {
    const store = contextStorage.getStore() as { session?: ClientSession };
    
    const updatedDocument = await <Promise<MongoResult<T> | null>>this.model
      .findOneAndUpdate(
        {
          _id: id,
          deleted: {
            $in: [null, false, options?.withDeleted],
          },
        },
        {
          ...props,
          updatedAt: new Date(),
        },
        {
          new: true,
          session: store?.session || null,
          projection: options?.select,
          populate: options?.populate,
        }
      )
      .lean()
      .exec();

    return MongoBaseRepositoryHelpers.formatDocument<T>(updatedDocument);
  }

  async disable(id: Identificator): Promise<Result<T>> {
    const store = contextStorage.getStore() as { session?: ClientSession };

    const disabledDocument = await <Promise<MongoResult<T> | null>>this.model
      .findOneAndUpdate(
        {
          _id: id,
        },
        {
          deleted: true,
          deletedAt: new Date(),
        },
        {
          new: true,
          session: store?.session || null,
        }
      )
      .lean()
      .exec();

    return MongoBaseRepositoryHelpers.formatDocument<T>(disabledDocument);
  }

  async restore(id: Identificator): Promise<Result<T>> {
    const store = contextStorage.getStore() as { session?: ClientSession };

    const restoredDocument = await <Promise<MongoResult<T> | null>>this.model
      .findOneAndUpdate(
        { _id: id, deleted: true }, 
        { deleted: false, $unset: { deletedAt: null } },
      )
      .setOptions({ new: true, session: store?.session || null })
      .lean()
      .exec();
    
    return MongoBaseRepositoryHelpers.formatDocument<T>(restoredDocument);
  }

  async delete(id: Identificator): Promise<Result<T> | null> {
    const store = contextStorage.getStore() as { session?: ClientSession };

    const deletedDocument = await <Promise<MongoResult<T> | null>>this.model
      .findByIdAndDelete(id)
      .setOptions({ session: store?.session || null })
      .lean()
      .exec();

    return MongoBaseRepositoryHelpers.formatDocument<T>(deletedDocument);
  }
}
