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
    telefone?: string;
    nif?: string;
    role?: string;
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
    token: string;
    user: IUser;
}