import mongoose from 'mongoose';

export class DefaultSchema<T> extends mongoose.Schema<T> {
  constructor(definition: mongoose.SchemaDefinition<mongoose.SchemaDefinitionType<T>>) {
    super({
      ...definition,
      deleted: {
        type: Boolean,
        default: false,
      },
      deletedAt: {
        type: Date,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    });
  }
}
