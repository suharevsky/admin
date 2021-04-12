import {BaseModel} from '../../../_metronic/shared/crud-table';

export interface UserPictureModel extends BaseModel {
    pic: string;
    user_id: string;
    valid: boolean;
}
