export interface ValidationResult<T = unknown> {
  isValid: boolean;
  data?: T;
  errorMessage?: string;
}

export interface Validator<T = unknown> {
  validate(data: unknown): ValidationResult<T>;
}
