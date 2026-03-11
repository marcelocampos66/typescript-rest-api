export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface Validator {
  validate(data: unknown): ValidationResult;
}
