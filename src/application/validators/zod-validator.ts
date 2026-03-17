import { z, ZodObject, ZodRawShape } from 'zod';
import { Validator, ValidationResult } from '../../core/protocols/validator';

export class ZodValidator<T extends ZodRawShape> implements Validator<z.infer<ZodObject<T>>> {
  constructor(private readonly schema: ZodObject<T>) {}

  public validate(data: unknown): ValidationResult<z.infer<ZodObject<T>>> {
    const result = this.schema.safeParse(data);

    if (!result.success) {
      return { isValid: false, errorMessage: result.error.issues[0].message };
    }

    return { isValid: true, data: result.data };
  }
}
