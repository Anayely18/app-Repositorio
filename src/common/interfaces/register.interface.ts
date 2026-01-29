export interface IRegisterForm {
    name: string;
    surname: string;
    dni: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface IRegisterErrors {
    name?: string;
    surname?: string;
    dni?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export interface IRegisterResponse {
    success: boolean;
    message: string;
    data?: unknown;
}
