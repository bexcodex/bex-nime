export interface ApiResponse<T> {
  status: 'Ok' | 'Error';
  message?: string;
  data?: T;
  pagination?: {
    current_page: number;
    last_visible_page: number;
    has_next_page: boolean;
    next_page: number | null;
    has_previous_page: boolean;
    previous_page: number | null;
  };
}

export const okResponse = <T>(data: T): ApiResponse<T> => ({
  status: 'Ok',
  data,
});

export const errorResponse = (message: string, data?: any): ApiResponse<any> => ({
  status: 'Error',
  message,
  data,
});

export const paginatedResponse = <T>(
  data: T, 
  pagination: ApiResponse<T>['pagination']
): ApiResponse<T> => ({
  status: 'Ok',
  data,
  pagination,
});
