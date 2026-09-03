export type ApiResponse<T> = { data: T; requestId?: string };
export type ApiError = {
  status: number;
  message: string;
  code?: string;
  fieldErrors?: Record<string, string>;
};
