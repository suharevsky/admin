import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InlineSVGModule} from 'ng-inline-svg';
import {ListComponent} from './list/list.component';
import {CRUDTableModule} from '../../_metronic/shared/crud-table';
import {SettingsRoutingModule} from './settings-routing.module';
import {NgbAlertModule, NgbDatepickerModule, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {SettingsComponent} from './settings.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@NgModule({
    declarations: [
        ListComponent,
        SettingsComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        SettingsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        CRUDTableModule, // +
        NgbModalModule,
        NgbDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        NgbAlertModule
    ],
    entryComponents: [
    ]
})
export class SettingsModule {
}
