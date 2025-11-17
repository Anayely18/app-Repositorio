export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export interface ApiError {
    status: number;
    message: string;
    data?: any;
}