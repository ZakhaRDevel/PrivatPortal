import {
    Directive,
    HostListener,
    ElementRef,
    OnInit,
    Input,
} from '@angular/core';

@Directive({ selector: '[phone]' })
export class PhoneDirective implements OnInit {
    private el: HTMLInputElement;
    @Input() code: string;

    constructor(private elementRef: ElementRef) {
        this.el = this.elementRef.nativeElement;
    }

    ngOnInit() {}

    @HostListener('input', ['$event']) beforeinput(event) {
        const value = this.el.value.toString();

        this.el.value =
            value.substring(0, this.code.length) === this.code
                ? value
                : this.code;
    }
}
