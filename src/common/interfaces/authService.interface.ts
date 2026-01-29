export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    surname: string;
    dni: string;
    email: string;
    password: string;
}

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