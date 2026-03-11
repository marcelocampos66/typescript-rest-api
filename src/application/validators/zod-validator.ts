import { ZodObject, ZodRawShape } from 'zod';
import { Validator, ValidationResult } from '../../core/protocols/validator';

export class ZodValidator<T extends ZodRawShape> implements Validator {
  constructor(private readonly schema: ZodObject<T>) {}

  public validate(data: unknown): ValidationResult {
    const result = this.schema.safeParse(data);

    if (!result.success) {
      return { isValid: false, errorMessage: result.error.issues[0].message };
    }

    return { isValid: true };
  }
}
