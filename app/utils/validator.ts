export class ValidatorError extends Error {
  genericMessage: string;

  constructor(
    message: string,
    genericMessage?: string,
  ) {
    super(message);
    this.genericMessage = genericMessage || message;
    this.name = 'ValidatorError';
  }
}

export class InvalidFormat extends ValidatorError {
  constructor(message: string, genericMessage?: string) {
    super(message, genericMessage);
    this.name = 'InvalidFormat';
  }
}

export class TooShort extends ValidatorError {
  public minLength: number;
  constructor(message: string, minLength: number, genericMessage?: string) {
    super(message, genericMessage);
    this.minLength = minLength;
    this.name = 'TooShort';
  }
}

export class TooLong extends ValidatorError {
  public maxLength: number;
  constructor(message: string, maxLength: number, genericMessage?: string) {
    super(message, genericMessage);
    this.maxLength = maxLength;
    this.name = 'TooLong';
  }
}

export class MissingValue extends ValidatorError {
  constructor(message: string, genericMessage?: string) {
    super(message, genericMessage);
    this.name = 'MissingValue';
  }
}

export class Validator {
  public static assertValidEmail(email: string): void {
    if (!email) {
      throw new MissingValue('Email is required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new InvalidFormat('Invalid email format');
    }
  }

  public static assertValidPassword(password: string): void {
    if (!password) {
      throw new MissingValue('Password is required');
    }
    if (password.length < 8) {
      throw new TooShort('Password must be at least 8 characters long', 8);
    }
    if (password.length > 40) {
      throw new TooLong('Password must be less than 40 characters long', 40);
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new InvalidFormat('Invalid password format');
    }
  }

  public static assertValidName(name: string): void {
    if (!name) {
      throw new MissingValue('Name is required');
    }
    if (name.length < 3) {
      throw new TooShort('Name must be at least 3 characters long', 3);
    }
    if (name.length > 20) {
      throw new TooLong('Name must be less than 20 characters long', 20);
    }
  }
}
