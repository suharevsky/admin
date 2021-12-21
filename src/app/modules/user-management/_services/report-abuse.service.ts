import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ITableState, TableResponseModel, TableService} from '../../../_metronic/shared/crud-table';
import {User} from '../_models/user.model';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {baseFilter} from '../../../_fake/fake-helpers/http-extenstions';

@Injectable({
    providedIn: 'root'
})
export class ReportAbuseService extends TableService<User> implements OnDestroy {
    API_URL = `${environment.apiUrl}/report-abuse`;

    constructor(@Inject(HttpClient) http) {
        super(http);
    }

    find(tableState: ITableState): Observable<TableResponseModel<any>> {
        return this.http.get<any>(this.API_URL).pipe(
            map((response) => {
                const filteredResult = baseFilter(response, tableState);
                return {
                    items: filteredResult.items,
                    total: filteredResult.total
                };
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
