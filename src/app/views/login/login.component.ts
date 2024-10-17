import { Component } from '@angular/core';
import { FRONTEND_BASE_URL } from '../../shared/env';
import { CLIENT_ID } from '../../shared/secrets'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

    loginRedirect() {
        document.location.href = `http://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${FRONTEND_BASE_URL}/exchange_token&approval_prompt=force&scope=read`
    }

}
