import {BaseModel} from '../../../_metronic/shared/crud-table';

export interface User extends BaseModel {
    id: number;
    uid: string;
    firstName: string;
    height: number;
    bodyType: number;
    maritalStatus: string;
    lastName: string;
    email: string;
    username: string;
    about: string;
    subscriptionStart: string;
    subscriptionEnd: string;
    preference: string[];
    photos: any;
    photo: string;
    lookingFor: string[];
    area: string;
    gender: string;
    status: number; // 1 - Active | Pending | Banned | Frozen | 0 - Deleted
    dateOfBirth: Date | string;
    registrationDate: string;
    ipAddress: string;
    subscription: boolean;
}
