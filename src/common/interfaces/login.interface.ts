export interface ILoginForm {
    email: string;
    password: string;
}

export interface ILoginErrors {
    email?: string;
    password?: string;
}

export interface ILoginResponse {
    success: boolean;
    message: string;
    data?: {
        token: string;
        user: unknown; 
    };
}