import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {of, Subscription} from 'rxjs';
import {UserService} from '../../../_services';
import {AngularFireStorage, AngularFireStorageReference} from '@angular/fire/storage';
import {FileUploadService} from '../../../../../services/file-upload/file-upload.service';
import {catchError, finalize, tap} from 'rxjs/operators';

@Component({
    selector: 'app-delete-user-photo-modal',
    templateUrl: './delete-user-photo-modal.component.html',
    styleUrls: ['./delete-user-photo-modal.component.scss']
})
export class DeleteUserPhotoModalComponent implements OnInit, OnDestroy {
    @Input() user: any;
    photo: any;
    isLoading = false;
    subscriptions: Subscription[] = [];
    ref: AngularFireStorageReference;
    fileUploadService: FileUploadService;

    constructor(private usersService: UserService, public modal: NgbActiveModal, private afStorage: AngularFireStorage,
    ) {
    }

    ngOnInit(): void {
    }

    deleteUserPhoto() {
        this.isLoading = true;


        const sb = this.usersService.update(this.user).pipe(
            tap(() => this.modal.close()),
            catchError((err) => {
                this.modal.dismiss(err);
                return of(undefined);
            }),
            finalize(() => {
                this.isLoading = false;
            })
        ).subscribe(photo => {
            // Create a reference to the file to delete
            this.ref = this.afStorage.ref('images/' + this.photo.url + '_120x120');
            this.ref.delete();
            this.ref = this.afStorage.ref('images/' + this.photo.url + '_200x200');
            this.ref.delete();
            this.ref = this.afStorage.ref('images/' + this.photo.url + '_600x600');
            this.ref.delete();
        });
        this.subscriptions.push(sb);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
