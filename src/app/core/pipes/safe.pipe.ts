import { Pipe, PipeTransform } from '@angular/core';
import {
    DomSanitizer,
    SafeHtml,
    SafeStyle,
    SafeScript,
    SafeUrl,
    SafeResourceUrl,
} from '@angular/platform-browser';

@Pipe({
    name: 'safe',
})
export class SafePipe implements PipeTransform {
    constructor(protected sanitizer: DomSanitizer) {}

    public transform(
        value: string,
        type: string
    ): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
        switch (type) {
            case 'html':
                const oembedRegex = /<oembed[^>]*>/g;
                const oembedMatch = value.match(oembedRegex);

                if (oembedMatch) {
                    let split1 = oembedMatch[0].split('?v=')[1];
                    let split2 = oembedMatch[0].split('https://youtu.be/');
                    let video = '';

                    if (split1) {
                        video = `https://www.youtube.com/embed/${split1.slice(
                            0,
                            -2
                        )}`;
                    } else if (split2[1]) {
                        video = `https://www.youtube.com/embed/${split2[1]}`;
                    } else {
                        video = oembedMatch[0].match(/url="([^"]*)"/)[1];
                    }
                    const iframeElement = `<iframe src="${video}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    value = value.replace(oembedRegex, iframeElement);
                }

                return this.sanitizer.bypassSecurityTrustHtml(value);

            case 'style':
                return this.sanitizer.bypassSecurityTrustStyle(value);

            case 'script':
                return this.sanitizer.bypassSecurityTrustScript(value);

            case 'url':
                return this.sanitizer.bypassSecurityTrustResourceUrl(value);

            case 'resourceUrl':
                return this.sanitizer.bypassSecurityTrustResourceUrl(
                    `data:image/jpg;base64,${value}`
                );
            default:
                return '';
        }
    }
}
