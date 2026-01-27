export interface IForgotPasswordForm {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
}

export interface IForgotPasswordErrors {
    email?: string;
    code?: string;
    newPassword?: string;
    confirmPassword?: string;
}

