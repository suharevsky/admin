import {Injectable, Inject, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseModel, ITableState, TableResponseModel, TableService} from '../../../_metronic/shared/crud-table';
import {User} from '../_models/user.model';
import {environment} from '../../../../environments/environment';
import {Observable, of, Subscription} from 'rxjs';
import {catchError, finalize, map, tap} from 'rxjs/operators';
import {baseFilter} from '../../../_fake/fake-helpers/http-extenstions';
import { UserPhoto } from '../_models/user-picture.model';

@Injectable({
    providedIn: 'root'
})
export class UserPhotoService extends TableService<User> implements OnDestroy {
    API_URL = `${environment.apiUrl}/users`;

    constructor(@Inject(HttpClient) http) {
        super(http);
    }


    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
