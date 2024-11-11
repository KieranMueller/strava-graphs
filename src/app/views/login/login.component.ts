import { Component } from '@angular/core'
import { environment } from '../../../environments/environment'
import { AuthService } from '../../shared/auth.service'
import { Router } from '@angular/router'
import { LOCAL_STORAGE_IS_DEMO_MODE } from '../../shared/env'

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    constructor(private router: Router) { }

    loginRedirect() {
        localStorage.setItem(LOCAL_STORAGE_IS_DEMO_MODE, JSON.stringify(false))
        document.location.href = `https://www.strava.com/oauth/authorize?client_id=${environment.CLIENT_ID}&response_type=code&redirect_uri=${environment.FRONTEND_BASE_URL}/exchange_token&approval_prompt=force&scope=read,read_all,profile:read_all,activity:read,activity:read_all`
    }

    demo() {
        localStorage.setItem(LOCAL_STORAGE_IS_DEMO_MODE, JSON.stringify(true))
        this.router.navigateByUrl('/home')
    }
}
