import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserPhotoService, UserService} from '../_services';
import {
    GroupingState,
    ICreateAction,
    IDeleteAction,
    IDeleteSelectedAction,
    IEditAction,
    IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, ISortView,
    IUpdateStatusForSelectedAction, PaginatorState, SortState
} from '../../../_metronic/shared/crud-table';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditUserModalComponent} from '../users/components/edit-user-modal/edit-user-modal.component';
import {DeleteUserModalComponent} from '../users/components/delete-user-modal/delete-user-modal.component';
import {UpdateUsersStatusModalComponent} from '../users/components/update-users-status-modal/update-users-status-modal.component';
import {FetchUsersModalComponent} from '../users/components/fetch-users-modal/fetch-users-modal.component';
import {FileUploadService} from '../../../services/file-upload/file-upload.service';
import {DeleteUserPhotoModalComponent} from '../users/components/delete-user-photo-modal/delete-user-photo-modal.component';
import { UserModel } from '../../auth';
import { User } from '../_models/user.model';

@Component({
    selector: 'app-user-pictures',
    templateUrl: './user-pictures.component.html',
    styleUrls: ['./user-pictures.component.scss'],
})
export class UserPicturesComponent
    implements OnInit,
        OnDestroy,
        ICreateAction,
        IEditAction,
        IDeleteAction,
        IDeleteSelectedAction,
        IFetchSelectedAction,
        IUpdateStatusForSelectedAction,
        ISortView,
        IFilterView,
        IGroupingView,
        ISearchView,
        IFilterView {
    paginator: PaginatorState;
    sorting: SortState;
    grouping: GroupingState;
    isLoading: boolean;
    filterGroup: FormGroup;
    searchGroup: FormGroup;
    private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        public fileUploadService: FileUploadService,
        // tslint:disable-next-line:no-shadowed-variable
        public userService: UserService,
        public userPhotoService: UserPhotoService
    ) {
    }

    // angular lifecircle hooks
    ngOnInit() {
        this.filterForm();
        this.searchForm();
        // this.userService.fetch();
        this.userService.getUnapprovedPhotos();
        this.grouping = this.userService.grouping;
        this.paginator = this.userService.paginator;
        this.sorting = this.userService.sorting;
        const sb = this.userService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
    }

    // filtration
    filterForm() {
        this.filterGroup = this.fb.group({
            status: [''],
            type: [''],
            searchTerm: [''],
        });
        this.subscriptions.push(
            this.filterGroup.controls.status.valueChanges.subscribe(() =>
                this.filter()
            )
        );
        this.subscriptions.push(
            this.filterGroup.controls.type.valueChanges.subscribe(() => this.filter())
        );
    }

    approval(photo) {
        photo.status = photo.status == 0 ? 1: 0;

        this.userService.getItemById(photo.userId).subscribe((user:User) => {
            user.photos.map(el => { 
                if(el.id === photo.id) {
                    el.status = el.status === 0 ? 1 : 0;
                }
                return el;
            });

            user.allPhotosApproved = this.userService.allPhotosApproved(user);

            this.userService.update(user).subscribe();
        });
    }

    filter() {
    }

    // search
    searchForm() {
    }

    search(searchTerm: string) {
    }

    // sorting
    sort(column: string) {
    }

    // pagination
    paginate(paginator: PaginatorState) {
        this.userService.patchState({paginator});
    }

    // form actions
    create() {
        this.edit(undefined);
    }

    edit(id: number) {
        console.log(id);
        const modalRef = this.modalService.open(EditUserModalComponent, {size: 'xl'});
        modalRef.componentInstance.id = id;
        modalRef.result.then(() =>
                this.userService.fetch(),
            () => {
            }
        );
    }

    delete(id: number) {
        console.log(id);
        const modalRef = this.modalService.open(DeleteUserModalComponent);
        modalRef.componentInstance.id = id;
        modalRef.result.then(() => this.userService.fetch(), () => {
        });
    }

    deleteSelected() {
        const modalRef = this.modalService.open(DeleteUserPhotoModalComponent);
        modalRef.componentInstance.ids = this.grouping.getSelectedRows();
        modalRef.result.then(() => this.userService.fetch(), () => {
        });
    }

    updateStatusForSelected() {
        const modalRef = this.modalService.open(UpdateUsersStatusModalComponent);
        modalRef.componentInstance.ids = this.grouping.getSelectedRows();
        modalRef.result.then(() => this.userService.fetch(), () => {
        });
    }

    fetchSelected() {
        const modalRef = this.modalService.open(FetchUsersModalComponent);
        modalRef.componentInstance.ids = this.grouping.getSelectedRows();
        modalRef.result.then(() => this.userService.fetch(), () => {
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }
}
