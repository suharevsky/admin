import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InlineSVGModule} from 'ng-inline-svg';
import {ListComponent} from './list/list.component';
import {CRUDTableModule} from '../../_metronic/shared/crud-table';
import {InboxRoutingModule} from './inbox-routing.module';
import {NgbDatepickerModule, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {InboxComponent} from './inbox.component';
import {DialogModalComponent} from './list/components/dialog-modal/dialog-modal.component';

@NgModule({
    declarations: [
        ListComponent,
        InboxComponent,
        DialogModalComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        InboxRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        CRUDTableModule, // +
        NgbModalModule,
        NgbDatepickerModule
    ],
    entryComponents: [
    ]
})
export class InboxModule {
}
