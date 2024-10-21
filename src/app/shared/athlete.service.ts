import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { LOCAL_STORAGE_KEY, STRAVA_BASE_URL } from './env'

@Injectable({
    providedIn: 'root'
})
export class AthleteService {

    constructor(private http: HttpClient) { }

    getAthleteActivities() {
        const tokenData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!)
        const headers = new HttpHeaders({
            Authorization: `Bearer ${tokenData.accessToken}`
        })
        return this.http.get(`${STRAVA_BASE_URL}/api/v3/athlete/activities`, { headers })
    }
}
