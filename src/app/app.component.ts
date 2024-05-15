import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { LangService } from './core/services/lang.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private langService: LangService
    ) {}
    ngOnInit() {
        this.document.documentElement.lang = this.langService.lang;
    }
}
