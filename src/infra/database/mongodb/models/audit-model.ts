import { model } from 'mongoose';
import { AuditSchema } from '../schemas';

export const AuditModel = model('Audit', AuditSchema);
