import { Component } from '@angular/core';
import { FRONTEND_BASE_URL } from '../../shared/env';
import { environment } from '../../../environment'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

    loginRedirect() {
        document.location.href = `http://www.strava.com/oauth/authorize?client_id=${environment.CLIENT_ID}&response_type=code&redirect_uri=${FRONTEND_BASE_URL}/exchange_token&approval_prompt=force&scope=read,read_all,profile:read_all,activity:read,activity:read_all`
    }

}
