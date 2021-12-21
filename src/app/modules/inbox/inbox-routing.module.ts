import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InboxComponent} from './inbox.component';
import {ListComponent} from './list/list.component';

const routes: Routes = [
    {
        path: '',
        component: InboxComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,
            },
            {path: '', redirectTo: 'customers', pathMatch: 'full'},
            {path: '**', redirectTo: 'customers', pathMatch: 'full'},
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InboxRoutingModule {
}
