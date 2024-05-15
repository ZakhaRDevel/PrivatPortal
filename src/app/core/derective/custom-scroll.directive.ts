import { Directive, ElementRef, Input } from '@angular/core';
import OverlayScrollbars from 'overlayscrollbars';

@Directive({
    selector: '[customScrollDetector]',
})
export class CustomScrollDirective {
    @Input() scrollSelectors: string[] = [];
    @Input() configs: MutationObserverInit = {
        childList: true,
        subtree: true,
        attributes: true,
    };
    private observer: MutationObserver;

    constructor(private elRef: ElementRef) {}

    ngAfterViewInit() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                if (
                    !this.scrollSelectors ||
                    !Array.isArray(this.scrollSelectors) ||
                    !this.scrollSelectors.length
                ) {
                    return;
                }

                this.scrollSelectors.forEach((selector) => {
                    OverlayScrollbars(document.querySelectorAll(selector), {});
                });
            });
        });

        this.observer.observe(this.elRef.nativeElement, this.configs);
    }
}
