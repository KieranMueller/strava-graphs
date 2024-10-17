import { Routes } from '@angular/router';
import { HandleAuthComponent } from './views/handle-auth/handle-auth.component'
import { LoginComponent } from './views/login/login.component'

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'exchange_token', component: HandleAuthComponent},
    {path: '**', redirectTo: '/login'}
];
