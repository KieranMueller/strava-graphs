import { Routes } from '@angular/router'
import { HandleAuthComponent } from './views/handle-auth/handle-auth.component'
import { LoginComponent } from './views/login/login.component'
import { HomeComponent } from './views/home/home.component'
import { isAuthenticated } from './guard/auth.guard'
import { AboutComponent } from './views/about/about.component'

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'exchange_token', component: HandleAuthComponent },
    { path: 'home', component: HomeComponent, canActivate: [isAuthenticated] },
    { path: 'about', component: AboutComponent },
    { path: '**', redirectTo: '/login' }
]
