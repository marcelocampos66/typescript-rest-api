import { Model } from 'mongoose';
import { MongoPopulate, MongoProjection, MongoRepository } from './mongo-repository';
import { Result } from '../../../../core/protocols/repository';
import { Identificator } from 'src/core/protocols';
import { AuditModel } from '../models';
import contextStorage from '../../../../core/context/context-storage';

export const enum Operations {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  LOGICAL_DELETE = 'LOGICAL_DELETE',
  LOGICAL_RESTORE = 'LOGICAL_RESTORE',
  HARD_DELETE = 'HARD_DELETE',
}

export class Audit {
  entity: string;
  operation: string;
  registry: Identificator;
  auditedAt: Date;
  modifiedBy: string;

  constructor({
    entity,
    operation,
    registry,
    modifiedBy,
    auditedAt,
  }: {
    entity: string;
    operation: Operations;
    registry: Identificator;
    auditedAt: Date;
    modifiedBy: string;
  }) {
    this.entity = entity;
    this.operation = operation;
    this.registry = registry;
    this.modifiedBy = modifiedBy;
    this.auditedAt = auditedAt;
  }
}

class AuditRepository extends MongoRepository<Audit> {
  constructor() {
    super(AuditModel);
  }
}

class MongoAuditedRepository<T> extends MongoRepository<T> {
  private readonly auditRepository: AuditRepository = new AuditRepository();

  constructor(model: Model<T>) {
    super(model);
  }

  async create(props: T): Promise<Result<T>> {
    const store = contextStorage.getStore() as { audit?: { user: string } };
    const newDocument = await super.create(props);
    if (newDocument && store?.audit) {
      const { id, createdAt, updatedAt, ...rest } = newDocument;
      await this.auditRepository.create(
        Object.assign(
          {
            operation: Operations.INSERT,
            model: this.model.modelName,
            registry: newDocument.id,
            auditedAt: new Date(),
            modifiedBy: store.audit.user,
          },
          rest,
        ) as unknown as Audit,
      );
    }

    return newDocument;
  }

  async update(
    id: Identificator,
    props: Partial<T>,
    options?: {
      populate?: MongoPopulate;
      select?: MongoProjection<T>;
      withDeleted?: boolean;
    }
  ): Promise<Result<T>> {
    const store = contextStorage.getStore() as { audit?: { user: string } };
    const updatedDocument = await super.update(id, props, options);
    if (updatedDocument && store?.audit) {
      const { id, createdAt, updatedAt, ...rest } = updatedDocument;
      await this.auditRepository.create(
        Object.assign(
          {
            operation: Operations.UPDATE,
            model: this.model.modelName,
            registry: updatedDocument.id,
            auditedAt: new Date(),
            modifiedBy: store.audit.user,
          },
          rest,
        ) as unknown as Audit,
      );
    }

    return updatedDocument;
  }

  async delete(id: Identificator): Promise<Result<T>> {
    const store = contextStorage.getStore() as { audit?: { user: string } };
    const removedDocument = await super.delete(id);
    if (removedDocument && store?.audit) {
      const { id, createdAt, updatedAt, ...rest } = removedDocument;
      await this.auditRepository.create(
        Object.assign(
          {
            operation: Operations.HARD_DELETE,
            model: this.model.modelName,
            registry: removedDocument.id,
            auditedAt: new Date(),
            modifiedBy: store.audit.user,
          },
          rest
        ) as unknown as Audit
      );
    }

    return removedDocument;
  }

  async disable(id: Identificator): Promise<Result<T>> {
    const store = contextStorage.getStore() as { audit?: { user: string } };
    const disabledDocument = await super.disable(id);
    if (disabledDocument && store?.audit) {
      const { id, createdAt, updatedAt, ...rest } = disabledDocument;
      await this.auditRepository.create(
        Object.assign(
          {
            operation: Operations.LOGICAL_DELETE,
            model: this.model.modelName,
            registry: disabledDocument.id,
            auditedAt: new Date(),
            modifiedBy: store.audit.user,
          },
          rest
        ) as unknown as Audit
      );
    }

    return disabledDocument;
  }

  async restore(id: Identificator): Promise<Result<T>> {
    const store = contextStorage.getStore() as { audit?: { user: string } };
    const restoredDocument = await super.restore(id);
    if (restoredDocument && store?.audit) {
      const { id, createdAt, updatedAt, ...rest } = restoredDocument;
      await this.auditRepository.create(
        Object.assign(
          {
            operation: Operations.LOGICAL_RESTORE,
            model: this.model.modelName,
            registry: restoredDocument.id,
            auditedAt: new Date(),
            modifiedBy: store.audit.user,
          },
          rest
        ) as unknown as Audit
      );
    }

    return restoredDocument;
  }
}

export default MongoAuditedRepository;
