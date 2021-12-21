import {BaseModel} from '../../../_metronic/shared/crud-table';
import DateTimeFormat = Intl.DateTimeFormat;

export interface User extends BaseModel {
    id: string;
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
    city: string;
    gender: string;
    status: number; // 1 - Active | Pending | Banned | Frozen | 0 - Deleted
    registrationDate: any;
    ipAddress: string;
    subscription: boolean;
    inbox: string[];
    viewedList: string[];
    favoriteList: string[];
    lastTimeActive: any;
    isAdmin: boolean;
    accessToken: string;
    refreshToken: string;
    expiresIn: Date | string;
    birthday: Date | string;
    allPhotosApproved: number;
    mainPhotoApproved: number;
    
}
