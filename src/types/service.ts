export interface IService {
    id: string;
    provider_id: string;
    name: string;
    description: string;
    category: EServiceCategory;
    duration: number;
    price: number;
    status: EServiceStatus;
    created_at: Date;
    updated_at: Date;
    provider?: {
        name: string;
        email: string;
        phone: string;
    }
}

export enum EServiceCategory {
    BEAUTY = 'BEAUTY',
    HEALTH = 'HEALTH',
    EDUCATION = 'EDUCATION',
    TECHNOLOGY = 'TECHNOLOGY',
    CONSULTING = 'CONSULTING',
    MAINTENANCE = 'MAINTENANCE',
    EVENTS = 'EVENTS',
    OTHER = 'OTHER',
}

export enum EServiceStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface ICreateServiceDTO {
    provider_id: string;
    name: string;
    description: string;
    category: EServiceCategory;
    duration: number;
    price: number;
}
