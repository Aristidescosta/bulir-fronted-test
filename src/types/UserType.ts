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
    nif: string;
    phone?: string | null | undefined;
    type: EUserType;
    status: EUserStatus;
    created_at: Date;
    updated_at: Date;
}

export enum EUserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
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