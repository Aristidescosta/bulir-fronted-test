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