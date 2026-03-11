import joi from 'joi';
import { Validator, ValidationResult } from '../../core/protocols/request-validator';

export class JoiValidator implements Validator {
  constructor(private readonly schema: joi.ObjectSchema) {}

  public validate(data: unknown): ValidationResult {
    const { error } = this.schema.validate(data, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      return { isValid: false, errorMessage: error.details[0].message };
    }

    return { isValid: true };
  }
}
