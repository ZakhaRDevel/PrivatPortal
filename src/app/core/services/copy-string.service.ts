import { Injectable } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';

@Injectable({
    providedIn: 'root',
})
export class CopyStringService {
    constructor(private _clipboardService: ClipboardService) {}

    copy(text: string) {
        this._clipboardService.copy(text);
    }
}
