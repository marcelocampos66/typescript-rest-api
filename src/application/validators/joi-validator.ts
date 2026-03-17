import joi from 'joi';
import { Validator, ValidationResult } from '../../core/protocols/validator';

export class JoiValidator<T = unknown> implements Validator<T> {
  constructor(private readonly schema: joi.ObjectSchema<T>) {}

  public validate(data: unknown): ValidationResult<T> {
    const { error, value } = this.schema.validate(data, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      return { isValid: false, errorMessage: error.details[0].message };
    }

    return { isValid: true, data: value as T };
  }
}
