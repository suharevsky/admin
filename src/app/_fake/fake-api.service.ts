import {Injectable} from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';
import {Observable} from 'rxjs';
import {UsersTable} from './fake-db/users.table';
import {CarsTable} from './fake-db/cars.table';
// ECommerce
import {UserPicturesTable} from './fake-db/user_pictures';

@Injectable({
    providedIn: 'root',
})
export class FakeAPIService implements InMemoryDbService {
    constructor() {
    }

    /**
     * Create Fake DB and API
     */
    createDb(): {} | Observable<{}> {
        // tslint:disable-next-line:class-name
        const db = {
            // auth module
            users: UsersTable.users,

            user_pictures: UserPicturesTable.userPictures,

            // data-table
            cars: CarsTable.cars,
        };
        return db;
    }
}
