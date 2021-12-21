import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {of, Subscription} from 'rxjs';
import {catchError, first, map, tap} from 'rxjs/operators';
import {CustomAdapter, CustomDateParserFormatter} from '../../../../../_metronic/core';
import {MessageService} from '../../../_services/message.service';

@Component({
    selector: 'app-dialog-modal',
    templateUrl: './dialog-modal.component.html',
    styleUrls: ['./dialog-modal.component.scss'],
    // NOTE: For this example we are only providing current component, but probably
    // NOTE: you will w  ant to provide your main App Module
    providers: [
        {provide: NgbDateAdapter, useClass: CustomAdapter},
        {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
    ]
})
export class DialogModalComponent implements OnInit, OnDestroy {
    @Input() id: number;
    isLoading$;
    chat: any;
    formGroup: FormGroup;
    private subscriptions: Subscription[] = [];

    constructor(
        private messagesService: MessageService,
        private fb: FormBuilder, public modal: NgbActiveModal
    ) {
    }

    ngOnInit(): void {
        this.isLoading$ = this.messagesService.isLoading$;
        this.loadChat();
    }

    loadChat() {
        const sb = this.messagesService.getItemById(this.id).pipe(
            first(),
            catchError((errorMessage) => {
                this.modal.dismiss(errorMessage);
                return of([]);
            })
        ).subscribe((chat: any) => {
            this.chat = chat;
        });
        this.subscriptions.push(sb);
    }

    nl2br(text: string) {
        if (!text) { return text; }
        return text.replace(/\n/gi, '<br>');
    }

    save() {
        this.prepareCustomer();
        this.create();
    }

    create() {
        const sbCreate = this.messagesService.create(this.chat).pipe(
            tap(() => {
                this.modal.close();
            }),
            catchError((errorMessage) => {
                this.modal.dismiss(errorMessage);
                return of(this.chat);
            }),
        ).subscribe((res: any) => this.chat = res);
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

    private prepareCustomer() {
        const formData = this.formGroup.value;
        this.chat.dob = new Date(formData.dob);
        this.chat.email = formData.email;
        this.chat.firstName = formData.firstName;
        this.chat.dateOfBbirth = formData.dob;
        this.chat.ipAddress = formData.ipAddress;
        this.chat.lastName = formData.lastName;
        this.chat.type = +formData.type;
        this.chat.userName = formData.userName;
    }
}
