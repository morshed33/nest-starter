export interface AppResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type ApiResponse<T> = AppResponse<T>;
