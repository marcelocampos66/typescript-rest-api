import { Model, Schema, model, ProjectionType } from 'mongoose';
import { MongoBaseRepository } from './mongo-base-repository';
import { Identificator, Populate, Result } from '../../../../core/protocols/repository';
import contextStorage from '../../../../core/context/context-storage';

enum Operations {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  LOGICAL_DELETE = 'LOGICAL_DELETE',
  LOGICAL_RESTORE = 'LOGICAL_RESTORE',
  HARD_DELETE = 'HARD_DELETE',
}

class Audit {
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
    operation: string;
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

const AuditSchema = new Schema<Audit>(
  {
    entity: { type: String, required: true },
    operation: Operations,
    registry: Schema.Types.Mixed,
    auditedAt: { type: Date, required: true },
    modifiedBy: Schema.Types.Mixed,
  },
  { strict: false, versionKey: false },
);

const AuditModel = model('Audit', AuditSchema);

class AuditRepository extends MongoBaseRepository<Audit> {
  constructor() {
    super(AuditModel);
  }
}

class MongoAuditedRepository<T> extends MongoBaseRepository<T> {
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
      populate?: Populate;
      select?: ProjectionType<T>;
      withDeleted?: boolean
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
