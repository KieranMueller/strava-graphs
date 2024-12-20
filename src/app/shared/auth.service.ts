import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs'
import { LOCAL_STORAGE_ACTIVITIES, LOCAL_STORAGE_ADV_SETTINGS, LOCAL_STORAGE_CLICK_POINT_REMOVE, LOCAL_STORAGE_IS_DEMO_MODE, LOCAL_STORAGE_SETTINGS_KEY, LOCAL_STORAGE_TOKEN_KEY, STRAVA_BASE_URL } from './env'
import { environment } from '../../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    exchangeAuthCodeForTokenData(code: string): Observable<Object> {
        const formData = new FormData()
        formData.append('client_id', environment.CLIENT_ID)
        formData.append('client_secret', environment.CLIENT_SECRET)
        formData.append('code', code)
        formData.append('grant_type', 'authorization_code')

        return this.http.post(`${STRAVA_BASE_URL}/oauth/token`, formData)
    }

    isAuthenticated(token: string): Observable<boolean> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        })
        return this.http.get(`${STRAVA_BASE_URL}/api/v3/athlete`, { headers }).pipe(
            map(() => true),
            catchError(() => of(false))
        )
    }

    wipeLocalStorage() {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY)
        localStorage.removeItem(LOCAL_STORAGE_SETTINGS_KEY)
        localStorage.removeItem(LOCAL_STORAGE_IS_DEMO_MODE)
        localStorage.removeItem(LOCAL_STORAGE_ADV_SETTINGS)
        localStorage.removeItem(LOCAL_STORAGE_CLICK_POINT_REMOVE)
        localStorage.removeItem(LOCAL_STORAGE_ACTIVITIES)
    }
}
