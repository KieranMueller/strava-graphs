import { TestBed } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideHttpClient } from '@angular/common/http'

import { AuthService } from './auth.service'

describe('AuthService', () => {
    let service: AuthService

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                AuthService
            ]
        })
        service = TestBed.inject(AuthService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
