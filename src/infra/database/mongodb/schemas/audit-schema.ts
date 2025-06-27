import { Schema } from 'mongoose'
import { Audit, Operations } from '../repositories/mongo-audited-repository';

export const AuditSchema = new Schema<Audit>(
  {
    entity: { type: String, required: true },
    operation: {
      type: String,
      enum: [
        Operations.INSERT,
        Operations.UPDATE,
        Operations.LOGICAL_DELETE,
        Operations.LOGICAL_RESTORE,
        Operations.HARD_DELETE,
      ]
    },
    registry: Schema.Types.Mixed,
    auditedAt: { type: Date, required: true },
    modifiedBy: Schema.Types.Mixed,
  },
  { strict: false, versionKey: false },
);
