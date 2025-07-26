export interface Meta {
  total: number;
  page: number;
  limit: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}
export interface Pagination<T = any> extends Meta {
  data: T[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  error?: string;
  timestamp: string;
  path?: string;
  meta?: Meta;
}
