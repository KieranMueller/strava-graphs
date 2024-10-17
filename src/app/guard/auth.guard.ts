import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { catchError, map, Observable, of } from 'rxjs'
import { AuthService } from '../shared/auth.service'
import { LOCAL_STORAGE_KEY } from '../shared/env'
import { TokenData } from '../shared/types'

export const isAuthenticated: CanActivateFn = (): Observable<boolean> => {
    const authService = inject(AuthService)
    const router = inject(Router)

    const tokenDataStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    let tokenDataObj: TokenData | {} = {}
    
    if (tokenDataStr) {
      try {
        tokenDataObj = JSON.parse(tokenDataStr)
      } catch (error) {
        console.error("Error parsing token data", error)
        router.navigateByUrl('/login')
        return of(false)
      }
    }

    if (!('accessToken' in tokenDataObj)) {
        router.navigateByUrl('/login')
        return of(false)
    }

    return authService.isAuthenticated(tokenDataObj.accessToken).pipe(
        map(bool => {
            if (bool) return true
            else {
                router.navigateByUrl('/login')
                return false
            }
        }),
        catchError(() => {
            router.navigateByUrl('/login')
            return of(false)
        })
    )
}