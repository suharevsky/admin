import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './modules/auth/_services/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./modules/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'error',
        loadChildren: () =>
            import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
    },
/*    {
        path: 'dashboard',
        loadChildren: () =>
            import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
    },*/
    {
        path: '',
        // canActivate: [AuthGuard],
        loadChildren: () =>
            import('./pages/layout.module').then((m) => m.LayoutModule),
        // import('./pages/home/home.module').then((m) => m.HomeModule),

    },
    /*{
        path: '',
        // canActivate: [AuthGuard],
        loadChildren: () =>
            import('./pages/home/home.module').then((m) => m.HomeModule),
    },*/

    {path: '**', redirectTo: 'error/404'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
