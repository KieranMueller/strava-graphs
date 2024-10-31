import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    pointRadius = new BehaviorSubject<number>(5)
    trendlineWidth = new BehaviorSubject<number>(2)
    aspectRatio = new BehaviorSubject<number>(1.5)

    constructor() { }
}
