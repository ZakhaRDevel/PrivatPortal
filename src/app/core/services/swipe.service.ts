import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CoreService } from './core.service';

@Injectable({
    providedIn: 'root',
})
export class SwipeService {
    isSwipe: boolean = false;
    swipeSide: string = '';

    isSwipeChange: Subject<any> = new Subject<any>();

    constructor(private coreService: CoreService) {
        if (coreService.isBrowser && window.innerWidth <= 1024) {
            this.isSwipeChange.subscribe((value) => {
                this.isSwipe = value;
            });

            this.swipe();
        }
    }

    swipe() {
        let touchstartX = null;
        let touchendX = null;
        let touchstartY = null;
        let touchendY = null;

        window.addEventListener('touchstart', (e) => {
            touchstartX = e.changedTouches[0].screenX;
            touchstartY = e.changedTouches[0].screenY;
        });
        window.addEventListener('touchend', (e) => {
            touchendX = e.changedTouches[0].screenX;
            touchendY = e.changedTouches[0].screenY;

            if (Math.abs(touchstartX - touchendX) > 50) {
                if (touchendX < touchstartX) this.swipeSide = 'left';
                if (touchendX > touchstartX) this.swipeSide = 'right';
                this.isSwipe = true;
                this.isSwipeChange.next(true);
            }

            if (Math.abs(touchstartY - touchendY) > 50) {
                if (touchendY < touchstartY) this.swipeSide = 'up';
                if (touchendY > touchstartY) this.swipeSide = 'down';
                this.isSwipe = true;
                this.isSwipeChange.next(true);
            }
        });
        this.isSwipeChange.next(false);
    }
}
