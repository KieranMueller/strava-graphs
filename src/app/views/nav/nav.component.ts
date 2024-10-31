import { Component, input } from '@angular/core'
import { Athlete } from '../../shared/types'
import { LOCAL_STORAGE_IS_DEMO_MODE, LOCAL_STORAGE_TOKEN_KEY } from '../../shared/env'
import { Router } from '@angular/router'

@Component({
    selector: 'app-nav',
    standalone: true,
    imports: [],
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.scss'
})
export class NavComponent {
    athlete = input.required<Athlete>()

    constructor(private router: Router) { }

    logout() {
        localStorage.removeItem(LOCAL_STORAGE_IS_DEMO_MODE)
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY)
        this.router.navigateByUrl('/login')
    }

    about() {
        this.router.navigateByUrl('/about')
    }
}
