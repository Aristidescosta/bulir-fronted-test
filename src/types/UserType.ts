export enum EUserType {
    CUSTOMER = 'CUSTOMER',
    PROVIDER = 'PROVIDER',
}

export interface IFormData {
    nome: string;
    email: string;
    telefone: string;
    password: string;
    confirmPassword: string;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    type: EUserType
    nif?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
}

export interface IRegisterData {
    name: string;
    email: string;
    phone: string;
    nif: string;
    password: string;
    type: EUserType
}

export interface ILoginData {
    email: string;
    password: string;
}

export interface IAuthResponse {
    success: boolean;
    message: string;
    data: {
        user: IUser;
        token: string;
        refreshToken: string
    }
}