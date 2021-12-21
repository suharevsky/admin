import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable, of, Subscription} from 'rxjs';
import {catchError, finalize, first, map, tap} from 'rxjs/operators';
import {User} from '../../../_models/user.model';
import {CustomAdapter, CustomDateParserFormatter} from '../../../../../_metronic/core';
import {UserService} from '../../../_services';
import {FieldService} from '../../../../../services/user/field.service';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {FileUploadService} from '../../../../../services/file-upload/file-upload.service';
import {DeleteUserPhotoModalComponent} from '../delete-user-photo-modal/delete-user-photo-modal.component';

const EMPTY_USER: User = {
    id: undefined,
    uid: undefined,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    about: '',
    height: undefined,
    maritalStatus: '',
    bodyType: undefined,
    subscriptionStart: '',
    subscriptionEnd: '',
    gender: '',
    preference: [],
    lastTimeActive: '',
    isAdmin: false,
    accessToken: '',
    expiresIn: '',
    refreshToken: '',
    favoriteList: [],
    lookingFor: [],
    viewedList: [],
    inbox: [],
    city: '',
    area: '',
    subscription: false,
    registrationDate: '',
    birthday: '',
    ipAddress: '',
    status: 2,
    photos: [],
    photo: '',
    allPhotosApproved: 0,
    mainPhotoApproved: 0
};

@Component({
    selector: 'app-edit-user-modal',
    templateUrl: './edit-user-modal.component.html',
    styleUrls: ['./edit-user-modal.component.scss'],
    // NOTE: For this example we are only providing current component, but probably
    // NOTE: you will want to provide your main App Module
    providers: [
        {provide: NgbDateAdapter, useClass: CustomAdapter},
        {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
    ]
})
export class EditUserModalComponent implements OnInit, OnDestroy {
    @Input() id: number;
    isLoading$;
    user: User;
    downloadURL;
    formGroup: FormGroup;
    task: AngularFireUploadTask;
    uploadProgress;
    imageBaseUrl: string;
    uploadState: Observable<string>;
    ref: AngularFireStorageReference;
    private subscriptions: Subscription[] = [];

    constructor(
        private userService: UserService,
        private afStorage: AngularFireStorage,
        public modalService: NgbModal,
        public userFieldService: FieldService,
        public fileUploadService: FileUploadService,
        private fb: FormBuilder,
        public modal: NgbActiveModal
    ) {
    }

    async ngOnInit() {
        this.isLoading$ = this.userService.isLoading$;
        this.loadUser();
    }

    loadUser() {
        if (!this.id) {
            this.user = EMPTY_USER;
            this.loadForm();
        } else {
            const sb = this.userService.getItemById(this.id).pipe(
                first(),
                catchError((errorMessage) => {
                    this.modal.dismiss(errorMessage);
                    return of(EMPTY_USER);
                })
            ).subscribe((user: User) => {
                this.user = user;
                this.loadForm();
            });
            this.subscriptions.push(sb);
        }
    }

    onCheckboxChange(e, field) {
        field = this.formGroup.get(field) as FormArray;

        if (e.target.checked) {
            field.value.push(e.target.value);
        } else {
            let i = 0;
            field.value.forEach((item: FormControl) => {
                if (item === e.target.value) {
                    field.value.splice(i, 1);
                    return;
                }
                i++;
            });
        }

        // @ts-ignore
        this.user[field] = field.value;
    }

    setMainPhoto(photo) {
        this.user.photos.map(el => {
            el.main = el.url === photo.url;
        });
    }

    setPhotoApproval(photo) {
        this.user.photos.map(el => {
            if (photo.url === el.url) {
                el.status = !(photo.status === 1 && el.status === 1) ? 1 : 0;
            }
        });
    }

    loadForm() {
        this.formGroup = this.fb.group({
            username: [this.user.username, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
            birthday: [this.user.birthday, Validators.compose([Validators.nullValidator])],
            ipAddress: [this.user.ipAddress],
            gender: [this.user.gender, Validators.compose([Validators.required])],
            about: [this.user.about, Validators.compose([Validators.required])],
            height: [this.user.height],
            maritalStatus: [this.user.maritalStatus],
            bodyType: [this.user.bodyType],
            subscription: [this.user.subscription],
            subscriptionStart: [this.user.subscriptionStart],
            subscriptionEnd: [this.user.subscriptionEnd],
            preference: [this.user.preference, Validators.compose([Validators.required])],
            lookingFor: [this.user.lookingFor],
            area: [this.user.area],
            status: [+this.user.status, Validators.compose([Validators.required])],

            isAdmin: [false],
            city: [''],
            inbox: [[]],
            viewedList: [[]],
            favoriteList: [[]],
            lastTimeActive: [Date.now()],
            accessToken: ['access-token-' + Math.random()],
            refreshToken: ['refreshToken-token-' + Math.random()],
            expiresIn: [new Date(Date.now() + 100 * 24 * 60 * 60 * 1000)],
            photos: [[]],
        });
    }

    save() {
        this.prepareUser();
        if (this.user.id) {
            this.edit();
        } else {
            this.create();
        }
    }

    deleteFile(user, photo) {
        const modalRef = this.modalService.open(DeleteUserPhotoModalComponent);
        user.photos = user.photos.filter(ph => ph.url !== photo.url);
        this.userService.allPhotosApproved(user);
        this.userService.mainPhotoApproved(user);

        modalRef.componentInstance.user = user;
        modalRef.componentInstance.photo = photo;
        modalRef.result.then(() => {
            this.user.photos = user.photos.filter(ph => ph.id !== photo.id);
        }, () => {
        });
    }

    uploadFile(event) {

        // this.fileUploadService.uploadFile(event);

        // create a random id
        const randomId = Math.random().toString(36).substring(2);
        // create a reference to the storage bucket location
        this.ref = this.afStorage.ref('/images/' + randomId);
        // the put method creates an AngularFireUploadTask
        // and kicks off the upload
        this.task = this.ref.put(event.target.files[0]);

        // AngularFireUploadTask provides observable
        // to get uploadProgress value
        this.uploadProgress = this.task.snapshotChanges()
            .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));

        // observe upload progress
        this.uploadProgress = this.task.percentageChanges();
        // get notified when the download URL is available
        this.task.snapshotChanges().pipe(
            finalize(() => {

                this.userService.getItemById(this.user.id).subscribe((user) => {
                    const photos = user.photos;
                    const mainPhoto = photos.filter(el => el.main === true);
                    // console.log(this.fileUploadService.getBaseUrl(randomId).subscribe(res => console.log(res)));
                    photos.push({status: 0, id: randomId, main: mainPhoto.length !== 1, url: randomId});

                    // save photo src to database
                    const photo = {
                        id: this.user.id,
                        photos
                    };
                    this.user.photos = photos;
                    this.user.allPhotosApproved = this.userService.allPhotosApproved(this.user);
                    this.user.mainPhotoApproved = this.userService.mainPhotoApproved(this.user);

                    this.userService.update(photo).subscribe();
                });

                this.downloadURL = this.ref.getDownloadURL();

            })
        ).subscribe();

        this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));

    }

    edit() {
        this.user.allPhotosApproved = this.userService.allPhotosApproved(this.user);
        this.user.mainPhotoApproved = this.userService.mainPhotoApproved(this.user);
        console.log(this.user)

        const sbUpdate = this.userService.update(this.user).pipe(
            tap(() => {
                this.modal.close();
            }),
            catchError((errorMessage) => {
                this.modal.dismiss(errorMessage);
                return of(this.user);
            }),
        ).subscribe(res => {
            // this.user = res;
            return this.user;
        });
        this.subscriptions.push(sbUpdate);
    }

    create() {
        const sbCreate = this.userService.create(this.user).pipe(
            tap(() => {
                this.modal.close();
            }),
            catchError((errorMessage) => {
                this.modal.dismiss(errorMessage);
                return of(this.user);
            }),
        ).subscribe((res: User) => this.user = res);
        this.subscriptions.push(sbCreate);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    // helpers for View
    isControlValid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

    controlHasError(validation, controlName): boolean {
        const control = this.formGroup.controls[controlName];
        return control.hasError(validation) && (control.dirty || control.touched);
    }

    isControlTouched(controlName): boolean {
        const control = this.formGroup.controls[controlName];
        return control.dirty || control.touched;
    }

    changeCheckBoxValueEvent(field) {

    }

    private prepareUser() {
        const formData = this.formGroup.value;
        this.user.birthday = new Date(formData.birthday);
        this.user.email = formData.email;
        this.user.ipAddress = formData.ipAddress;
        this.user.gender = formData.gender;
        this.user.area = formData.area;
        this.user.about = formData.about;
        this.user.height = formData.height;
        this.user.bodyType = formData.bodyType;
        this.user.maritalStatus = formData.maritalStatus;
        this.user.preference = formData.preference;
        this.user.status = formData.status;
        this.user.username = formData.username;
        this.user.subscription = formData.subscription;
        this.user.subscriptionStart = formData.subscriptionStart;
        this.user.subscriptionEnd = formData.subscriptionEnd;
        this.user.isAdmin = true;
        this.user.city = formData.city;
        this.user.inbox = [];
        this.user.viewedList = [];
        this.user.favoriteList = [];
        this.user.lastTimeActive = Date.now();
        this.user.accessToken = 'access-token-' + Math.random();
        this.user.refreshToken = 'refreshToken-token-' + Math.random();
        this.user.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
        this.user.registrationDate = Date.now();
    }
}
