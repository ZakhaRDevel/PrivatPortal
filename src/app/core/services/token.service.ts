import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    constructor(private localStorageService: LocalStorageService) {}

    get token(): string {
        return this.localStorageService.getItem('token');
    }

    setToken(token: string) {
        return this.localStorageService.setItem('token', token);
    }

    clearToken() {
        return this.localStorageService.removeItem('token');
    }
}
