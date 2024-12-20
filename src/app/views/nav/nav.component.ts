import { Component, input } from '@angular/core'
import { Athlete } from '../../shared/types'
import { LOCAL_STORAGE_IS_DEMO_MODE, LOCAL_STORAGE_TOKEN_KEY } from '../../shared/env'
import { Router } from '@angular/router'
import { AuthService } from '../../shared/auth.service'

@Component({
    selector: 'app-nav',
    standalone: true,
    imports: [],
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.scss'
})
export class NavComponent {
    athlete = input.required<Athlete>()

    constructor(private router: Router, private authService: AuthService) { }

    logout() {
        this.authService.wipeLocalStorage()
        this.router.navigateByUrl('/login')
    }

    about() {
        this.router.navigateByUrl('/about')
    }
}
