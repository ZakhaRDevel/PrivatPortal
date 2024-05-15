import {
    trigger,
    transition,
    style,
    animate,
    state,
} from '@angular/animations';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { ModalWindowService } from './modal-window.service';

@Component({
    selector: 'app-modal-window',
    templateUrl: './modal-window.component.html',
    styleUrls: ['./modal-window.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('modal', [
            transition('void => *', [
                style({ transform: 'scale3d(.3, .3, .3)' }),
                animate(200),
            ]),
            transition('* => void', [
                animate(200, style({ transform: 'scale3d(.0, .0, .0)' })),
            ]),
        ]),
    ],
})
export class ModalWindowComponent implements OnInit {
    @Input() id: string;
    @Input() typeTwo: boolean;
    private element: any;
    shown: boolean;
    playLeaveAnimation: boolean;

    @Output() onCloseEvent: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private modalService: ModalWindowService,
        private el: ElementRef
    ) {
        this.element = el.nativeElement;
    }

    ngOnInit(): void {
        if (!this.id) {
            return;
        }

        document.body.appendChild(this.element);

        this.modalService.add(this);
    }

    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
    }

    open(): void {
        this.setCss('hidden', this.getScrollbarWidth());
        this.shown = true;
    }

    close(): void {
        this.playLeaveAnimation = true;
    }

    hardClose(): void {
        this.onCloseEvent.emit(this.id);
        this.modalService.close(this.id);
    }

    private setCss(overflow: string, padding: number): void {
        const body = document.querySelector('body') as HTMLBodyElement;
        // const main = document.querySelector('.main__wrapper') as HTMLElement;
        // const accountHeader = document.querySelector('.header__desctop') as HTMLElement;
        const intBodyHeight = body.offsetHeight;
        const intBrowsHeight = window.innerHeight;
        body.style.overflow = overflow;
        // main.style.paddingRight = `${padding}px`;
        // accountHeader.style.paddingRight = `${padding + 8}px`;
        if (intBodyHeight > intBrowsHeight) {
            // main.style.paddingRight = `${padding}px`;
            // accountHeader.style.paddingRight = `${padding + 8}px`;
        }
    }

    private getScrollbarWidth(): number {
        const outer = document.createElement('div') as any;
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        outer.style.msOverflowStyle = 'scrollbar';
        document.body.appendChild(outer);

        const inner = document.createElement('div');
        outer.appendChild(inner);

        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

        outer.parentNode.removeChild(outer);

        return scrollbarWidth;
    }

    onAnimationEvent(event: any) {
        if (this.playLeaveAnimation) {
            this.setCss('initial', 0);
            this.playLeaveAnimation = false;
            this.shown = false;
        }
    }
}
