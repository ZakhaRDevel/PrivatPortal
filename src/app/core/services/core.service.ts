import {
    Inject,
    Injectable,
    PLATFORM_ID,
    Renderer2,
    RendererFactory2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class CoreService {
    public isBrowser = false;

    private renderer: Renderer2;

    private referrer: string;

    constructor(
        @Inject(PLATFORM_ID) platformId,
        rendererFactory: RendererFactory2
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    setReferrer(clear?: boolean) {
        this.referrer = clear ? '' : document.referrer;
    }

    getReferrer() {
        return this.referrer;
    }
}
