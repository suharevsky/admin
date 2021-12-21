import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ITableState, TableResponseModel, TableService} from '../../../_metronic/shared/crud-table';
import {Customer} from '../_models/customer.model';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {baseFilter} from '../../../_fake/fake-helpers/http-extenstions';
import {AuthService} from '../../auth';
import {DateHelper} from '../../../helpers/date.helper';

@Injectable({
    providedIn: 'root'
})
export class MessageService extends TableService<Customer> implements OnDestroy {
    API_URL = `${environment.apiUrl}/messages`;

    constructor(@Inject(HttpClient) http, private authService: AuthService) {
        super(http);
    }

    find(tableState: ITableState): Observable<any> {
        return this.http.get<any>(this.API_URL).pipe(
            map((response: any) => {
                response = response.map(el => {

                    el.messages.map(m => {
                        m.id = el.id;
                        m.uid1 = el.uid1;
                        m.uid2 = el.uid2;
                        m.time = DateHelper.getCurrentTime(m.createdAt);
                        m.date = DateHelper.formatMovementDate(m.createdAt, 'he-IL');
                        return m;
                    });
                    return el.messages[el.messages.length - 1];
                });

                response = response.flat();

                console.log(response);

                const filteredResult = baseFilter(response, tableState);

                const result: TableResponseModel<any> = {
                    items: filteredResult.items,
                    total: filteredResult.total
                };
                return result;
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
