import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {of, Subscription} from 'rxjs';
import {catchError, delay, finalize, tap} from 'rxjs/operators';
import {UserService} from '../../../_services';
import {AngularFireStorage, AngularFireStorageReference} from '@angular/fire/storage';

@Component({
    selector: 'app-delete-user-modal',
    templateUrl: './delete-user-modal.component.html',
    styleUrls: ['./delete-user-modal.component.scss']
})
export class DeleteUserModalComponent implements OnInit, OnDestroy {
    @Input() user: any;
    isLoading = false;
    ref: AngularFireStorageReference;
    subscriptions: Subscription[] = [];

    constructor(private usersService: UserService, public modal: NgbActiveModal, private afStorage: AngularFireStorage) {
    }

    ngOnInit(): void {
    }

    deleteUser() {
        this.isLoading = true;
        if (this.user.photos.length > 0) {
            for (const photo of this.user.photos) {
                this.ref = this.afStorage.ref('images/' + photo.id + '_120x120');
                this.ref.delete();
                this.ref = this.afStorage.ref('images/' + photo.id + '_200x200');
                this.ref.delete();
                this.ref = this.afStorage.ref('images/' + photo.id + '_600x600');
                this.ref.delete();
            }
        }

        const sb = this.usersService.delete(this.user.id).pipe(
            tap(() => this.modal.close()),
            catchError((err) => {
                this.modal.dismiss(err);
                return of(undefined);
            }),
            finalize(() => {
                this.isLoading = false;
            })
        ).subscribe();
        this.subscriptions.push(sb);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
