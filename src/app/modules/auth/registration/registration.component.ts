import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import {Subscription, Observable, of} from 'rxjs';
import {AuthService} from '..';
import {IpService} from '../../../services/ip/ip.service';
import {Router} from '@angular/router';
import {ConfirmPasswordValidator} from './confirm-password.validator';
import {UserModel} from '..';
import {delay, first, map} from 'rxjs/operators';
import {ErrorService} from '../../../services/error.service';
import {UniqueEmailValidator} from '../../../validators/unique-email.validator';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
    registrationForm: FormGroup;
    hasError: boolean;
    isLoading$: Observable<boolean>;
    ipAddress: string;

    // private fields
    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private ipService: IpService,
        private uniqueEmailValidator: UniqueEmailValidator,
        public errorService: ErrorService
    ) {
        this.isLoading$ = this.authService.isLoading$;
        // redirect to home if already logged in
        if (this.authService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.registrationForm.controls;
    }

    ngOnInit(): void {
        this.initForm();
        this.ipService.getIPAddress().subscribe((res: any) => {
            this.ipAddress = res.ip;
        });
    }

    initForm() {
        this.registrationForm = this.fb.group(
            {
                username: [
                    '',
                    Validators.compose([
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(100),
                    ]),
                ],
                email: [
                    'aliksui.ua@gmail.com',
                    Validators.compose([
                        Validators.required,
                        Validators.email,
                        Validators.minLength(3),
                        Validators.maxLength(320),
                    ]), [this.uniqueEmailValidator.emailValidator()]
                ],
                password: [
                    '',
                    Validators.compose([
                        Validators.required,
                        Validators.minLength(6),
                        Validators.maxLength(100),
                    ]),
                ],
                cPassword: [
                    '',
                    Validators.compose([
                        Validators.required,
                        Validators.minLength(6),
                        Validators.maxLength(100),
                    ]),
                ],
                agree: [false, Validators.compose([Validators.required])],
            },
            {
                validators: [ConfirmPasswordValidator.MatchPassword]
            }
        );
    }

    submit() {
        this.hasError = false;
        const result = {};
        Object.keys(this.f).forEach(key => {
            result[key] = this.f[key].value;
        });
        const newUser = new UserModel();

        newUser.setUser(result);

        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ':' + today.getMinutes();

        newUser.registrationDate = date + ' ' + time;
        newUser.photos = [];
        newUser.lookingFor = [];
        newUser.status = +1;
        newUser.preference = [];
        newUser.ipAddress = this.ipAddress;
        newUser.accessToken = 'access-token-' + Math.random();
        newUser.refreshToken = 'access-token-' + Math.random();
        newUser.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);

        const registrationSubscr = this.authService
            .registration(newUser)
            .pipe(first())
            .subscribe((user: UserModel) => {
                if (user) {
                    this.router.navigate(['/']);
                } else {
                    this.hasError = true;
                }
            });
        this.unsubscribe.push(registrationSubscr);
    }

    ngOnDestroy() {
    }
}
