import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SignupComponent} from './signup.component';

@NgModule({
    declarations: [SignupComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'signup',
                component: SignupComponent,
            },
        ]),
    ]
})
export class SignupModule {
}
