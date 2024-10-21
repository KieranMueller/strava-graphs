import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthService } from '../../shared/auth.service'
import { TokenData } from '../../shared/types'
import { LOCAL_STORAGE_TOKEN_KEY } from '../../shared/env'

@Component({
    selector: 'app-handle-auth',
    standalone: true,
    imports: [],
    templateUrl: './handle-auth.component.html',
    styleUrl: './handle-auth.component.scss'
})
export class HandleAuthComponent implements OnInit {
    message = 'Please authenticate'

    constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

    ngOnInit() {
        let params = this.route.snapshot.queryParams
        this.authService.exchangeAuthCodeForTokenData(params['code']).subscribe({
            next: (data: any) => {
                this.saveTokenDataToLocalStorage(data)
                this.message = 'Success, redirecting...'
                this.router.navigateByUrl('/home')
            }, error: (e: any) => {
                console.log(e)
                this.message = 'Something went wrong...'
            }
        })
    }

    saveTokenDataToLocalStorage(data: any) {
        let tokenData: TokenData = {
            accessToken: data['access_token'],
            athlete: data['athlete'],
            expiresAt: data['expires_at'],
            expiresIn: data['expires_in'],
            refreshToken: data['refresh_token'],
            tokenType: data['token_type']
        }
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, JSON.stringify(tokenData))
    }

}
