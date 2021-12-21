import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsersComponent} from './users/users.component';
import {RolesComponent} from './roles/roles.component';
import {UserManagementComponent} from './user-management.component';
import {UserManagementRoutingModule} from './user-management-routing.module';
import {DeleteReportAbuseModalComponent} from './report-abuse/components/delete-report-abuse-modal/delete-report-abuse-modal.component';
import {FetchUsersModalComponent} from './users/components/fetch-users-modal/fetch-users-modal.component';
import {DeleteUserModalComponent} from './users/components/delete-user-modal/delete-user-modal.component';
import {EditUserModalComponent} from './users/components/edit-user-modal/edit-user-modal.component';
import {UpdateUsersStatusModalComponent} from './users/components/update-users-status-modal/update-users-status-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CRUDTableModule} from '../../_metronic/shared/crud-table';
import {InlineSVGModule} from 'ng-inline-svg';
import {NgbDatepickerModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {MatFormFieldModule} from '@angular/material/form-field';
import {UserPicturesComponent} from './user-pictures/user-pictures.component';
import {DeleteUserPhotoModalComponent} from './users/components/delete-user-photo-modal/delete-user-photo-modal.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ReportAbuseComponent} from './report-abuse/report-abuse.component';

@NgModule({
    declarations: [UsersComponent, RolesComponent, UserManagementComponent, DeleteReportAbuseModalComponent, FetchUsersModalComponent,
        DeleteUserModalComponent, DeleteUserPhotoModalComponent, FetchUsersModalComponent, EditUserModalComponent,
        UpdateUsersStatusModalComponent,
        UserPicturesComponent, ReportAbuseComponent],
    imports: [CommonModule, UserManagementRoutingModule, FormsModule, ReactiveFormsModule, CRUDTableModule, InlineSVGModule,
        NgbDatepickerModule, MatFormFieldModule, NgbProgressbarModule, MatRadioModule, MatCheckboxModule],
})
export class UserManagementModule {
}
