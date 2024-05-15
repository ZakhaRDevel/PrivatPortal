import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CoreService } from './core.service';

@Injectable({
    providedIn: 'root',
})
export class CheckScreenSizeService {
    sizeWindow: number = window.innerWidth;

    isResize: Subject<any> = new Subject<any>();
    isMobile: boolean = this.sizeWindow < 1024 ? true : false;

    constructor(private coreService: CoreService) {
        if (coreService.isBrowser) {
            this.isResize.subscribe((value) => {
                this.sizeWindow = value;
            });

            this.resize();
        }
    }

    resize() {
        window.addEventListener('resize', () => {
            this.isResize.next(window.innerWidth);
        });
    }
}
