import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TableService} from '../../../_metronic/shared/crud-table';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import firebase from 'firebase/app';

@Injectable({
    providedIn: 'root'
})
export class AdminSettingsService extends TableService<any> {
    API_URL = `${environment.apiUrl}/adminSettings`;

    constructor(@Inject(HttpClient) http, private db: AngularFirestore) {
        super(http);
    }

    get(): Observable<any> {
        return this.http.get<any>(this.API_URL).pipe(
            map((response: any) => {
                response = {id: response[0].id, ...response[0].settings};
                console.log(response);
                return response;
            })
        );
    }

    edit(item) {

        const data = {
            onlineDuration: item.onlineDuration
        };

        const ref = this.db.collection('adminSettings').doc(item.id);

        return ref.update({
            settings: data,
        });
    }
}
