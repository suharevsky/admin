import {Injectable, Inject, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseModel, ITableState, TableResponseModel, TableService} from '../../../_metronic/shared/crud-table';
import {User} from '../_models/user.model';
import {environment} from '../../../../environments/environment';
import {Observable, of, Subscription} from 'rxjs';
import {catchError, finalize, map, tap} from 'rxjs/operators';
import {baseFilter} from '../../../_fake/fake-helpers/http-extenstions';

@Injectable({
    providedIn: 'root'
})
export class UserService extends TableService<User> implements OnDestroy {
    API_URL = `${environment.apiUrl}/users`;

    constructor(@Inject(HttpClient) http) {
        super(http);
    }
    // READ
    find(tableState: ITableState): Observable<TableResponseModel<User>> {
        return this.http.get<User[]>(this.API_URL).pipe(
            map((response: User[]) => {
                response.forEach(el => {
                    el.photo = this.getMainPhoto(el.photos);
                    return el;
                });

                const filteredResult = baseFilter(response, tableState);
                const result: TableResponseModel<User> = {
                    items: filteredResult.items,
                    total: filteredResult.total
                };
                return result;
            })
        );
    }

    allPhotosApproved(user) {
        const photos = user.photos.filter(photo => {
            return photo.status === 0;
        });
        return user.allPhotosApproved = photos.length === 0 ? 1 : 0;
    }

    mainPhotoApproved(user) {
        const photos = user.photos.filter(photo => {
            return photo.status === 1 && photo.main;
        });
        return user.mainPhotoApproved = photos.length === 1 ? 1 : 0;
    }

    // READ
    getUnapprovedPhotos(): any {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        // console.log(this._tableState$.value);
        const request = this.http.get<User[]>(this.API_URL + '/photos/unapproved').pipe(
            map((response: User[]) => {
                console.log('User Data',response);

                response.forEach(el => {
                    el.photo = this.getMainPhoto(el.photos);
                    return el;
                });

                console.log('User Data',response);

                const filteredResult = baseFilter(response, this._tableState$.value);
                const result: TableResponseModel<User> = {
                    items: filteredResult.items,
                    total: filteredResult.total
                };
                return result;
            })

        ).pipe(
                tap((res) => {
                    const result: any = res.items.map((user: any) => {
                        // console.log(user);
                        user.photos.map(photo => {
                            photo.username = user.username;
                            photo.userId = user.id;
                            return photo;
                        });

                        console.log(user.photos);

                        return user.photos.filter(p => p.status === 0);
                    });

                    this._items$.next(result.flat());
                    this.patchStateWithoutFetch({
                        paginator: this._tableState$.value.paginator.recalculatePaginator(
                            res.total
                        ),
                    });
                }),
                catchError((err) => {
                    this._errorMessage.next(err);
                    return of({
                        items: [],
                        total: 0
                    });
                }),
                finalize(() => {
                    this._isLoading$.next(false);
                    const itemIds = this._items$.value.map((el: any) => {
                        const item = (el as unknown) as BaseModel;
                        return item.id;
                    });
                    this.patchStateWithoutFetch({
                        grouping: this._tableState$.value.grouping.clearRows(itemIds),
                    });
                })
            ).subscribe();
        this._subscriptions.push(request);
    }

    getMainPhoto(photos) {
        let photo:any = [];

        if(photos?.length > 0) {
            photo = photos.filter(el => el.main === true);
        }
        photo = (photo.length > 0) ? photo[0] : {url: './assets/media/users/default.jpg'};
        photo.url = (photo.status === 1) ? photo.url : './assets/media/users/default.jpg';
        return photo;
    }

    savePhoto(item): Observable<any> {
        const url = `${this.API_URL}/${item.id}`;

        return this.http.put(url, item).pipe(
            catchError(err => {
                console.error('UPDATE ITEM', item, err);
                return of(item);
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    // DELETE
    deletePhoto(user: object, photo): Observable<any> {
        const url = `${this.API_URL}/photo/${photo.url}`;
        return this.http.delete(url).pipe(
            catchError(err => {
                return of({});
            }),
        );
    }
}
