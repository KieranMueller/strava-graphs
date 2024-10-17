import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs'
import { STRAVA_BASE_URL } from './env'
import { environment } from '../../environment'

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
    return this.http.get(`${STRAVA_BASE_URL}/api/v3/athlete`, {headers}).pipe(
        map(() => true),
        catchError(() => of(false))
    )
  }
}
