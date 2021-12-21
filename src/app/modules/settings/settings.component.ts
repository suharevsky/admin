import {Component, OnInit} from '@angular/core';
import {GroupingState} from '../../_metronic/shared/crud-table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminSettingsService} from './_services/admin-settings.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
    grouping: GroupingState;
    isLoading: boolean;
    settingsGroup: FormGroup;
    docId: string;

    constructor(
        private fb: FormBuilder,
        public adminSettingsService: AdminSettingsService,
    ) {
        this.initForm();
    }

    get f() {
        return this.settingsGroup.controls;
    }

    initForm() {
        this.settingsGroup = this.fb.group({
            onlineDuration: ['', Validators.required],
        });
    }

    ngOnInit(): void {

        this.adminSettingsService.get().subscribe(settings => {
            this.docId = settings.id;
            this.f.onlineDuration.setValue(settings.onlineDuration);
        });

    }

    edit() {
        const result = {id: this.docId};
        Object.keys(this.f).forEach(key => {
            result[key] = this.f[key].value;
        });

        this.adminSettingsService.edit(result).then(_ => location.reload());
    }
}



