export type ApiResponse<T> = { data: T; requestId?: string };

export class ApiError extends Error {
  status: number;
  code?: string;
  fieldErrors?: Record<string, string>;
  data?: any;

  constructor(
    message: string,
    status: number,
    options?: { code?: string; fieldErrors?: Record<string, string>; data?: any }
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = options?.code;
    this.fieldErrors = options?.fieldErrors;
    this.data = options?.data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

