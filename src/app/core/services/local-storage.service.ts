import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    constructor() {}

    getItem(key: string) {
        const value: string = localStorage.getItem(key) || '';
        let json: any;
        try {
            json = JSON.parse(value);
        } catch (e) {}

        return json || value;
    }

    setItem(key: string, value: any): void {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }

        localStorage.setItem(key, value);
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
    }

    clear() {
        localStorage.clear();
    }
}
