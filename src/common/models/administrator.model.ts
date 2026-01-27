export interface Administrator {
    id?: number;           
    name: string;
    surname: string;
    dni: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    createdAt?: string;    
}