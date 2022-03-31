import {BaseModel} from '../../../_metronic/shared/crud-table';

export interface UserPhoto extends BaseModel {
    pic: string;
    status: number;
    userId: string;
}
