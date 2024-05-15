import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    public introRevealed: boolean  = false;
    public contentRevealed: boolean  = false;
    public firstLoad: boolean  = false;
    public isLoading: boolean = true;
    private renderer: Renderer2;

    constructor(
        private router: Router,
        private rendererFactory: RendererFactory2
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.showLoader();
            }
            if (event instanceof NavigationEnd) {
                if (event.url !== '/') {
                    this.hideLoader();
                }
            }
        });
    }

    revealIntro(revealContentPause = 1) {
        this.renderer.addClass(document.querySelector('html'), 'reveal-intro');
        this.introRevealed = true;
        setTimeout(() => {
            this.contentRevealed = true;
            this.renderer.removeClass(document.body, 'fixed');
        }, revealContentPause);
    }

    showLoader() {
        if (this.isLoading) {
            return;
        }

        this.isLoading = true;
        // if (this.firstLoad === false) {
        //     if (document.getElementById('website-loader')) {
        //         this.renderer.removeClass(document.body, 'loaded');
        //         this.renderer.setStyle(document.getElementById('website-loader'), 'display', 'flex');
        //     }
        // } else {
        //     if (document.getElementById('secondary-loader')) {
        //         this.renderer.removeClass(document.body, 'loaded');
        //         this.renderer.setStyle(document.getElementById('secondary-loader'), 'display', 'block');
        //     }
        // }
    }

    hideLoader() {
        if (!this.isLoading) {
            return;
        }

        this.isLoading = false;
        // if (this.firstLoad === false) {
        //     this.renderer.addClass(document.body, 'loaded');
        //     setTimeout(() => {
        //         if (document.getElementById('website-loader')) {
        //             this.renderer.setStyle(document.getElementById('website-loader'), 'display', 'none');
        //         }
        //     }, 600);
        //     this.firstLoad = true;
        // } else {
        //     this.renderer.addClass(document.body, 'loaded');
        //     setTimeout(() => {
        //         if (document.getElementById('secondary-loader')) {
        //             this.renderer.setStyle(document.getElementById('secondary-loader'), 'display', 'none');
        //         }
        //     }, 500);
        // }
    }
}
