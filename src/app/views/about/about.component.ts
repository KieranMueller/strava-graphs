import { Component, OnInit } from '@angular/core'
import { NavComponent } from '../nav/nav.component'
import { LOCAL_STORAGE_TOKEN_KEY } from '../../shared/env'
import { Router } from '@angular/router'

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [NavComponent],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
    athlete = null

    constructor(private router: Router) { }

    ngOnInit(): void {
        const tokenData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)!)
        console.log(tokenData)
        this.athlete = tokenData.athlete
    }

    backHome() {
        this.router.navigateByUrl('/home')
    }

    github() {
        window.open('https://github.com/KieranMueller/strava-graphs')
    }

    youtube() {
        window.open('https://www.youtube.com/@KieranMueller')
    }
}
