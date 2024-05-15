import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'app-form-prompt',
    templateUrl: './form-prompt.component.html',
    styleUrls: ['./form-prompt.component.scss'],
})
export class FormPromptComponent implements OnInit, AfterViewInit {
    @ViewChild('dropdown') elem: ElementRef;
    @ViewChild('iconStatus') iconStatus: ElementRef;
    @Input() dropdownText;
    @Input() icon;
    @Input() tultipDark;
    @Input() isTelegramCheck;
    dropdown;
    is_openStatusDropdown = false;
    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.onDropdownSize();
    }

    clickOpenStatusDropdown() {
        if (window.innerWidth < 1024) {
            this.handleDropdownPosition();
            this.is_openStatusDropdown = true;

            setTimeout(() => {
                this.is_openStatusDropdown = false;
            }, 4000);
        }
    }

    handleDropdownPosition() {
        this.dropdown = this.elem.nativeElement;
        const dropdownRect = this.dropdown.getBoundingClientRect();
        const dropdownRightX = dropdownRect.x + dropdownRect.width;

        if (dropdownRect.x < 0) {
            this.dropdown.classList.remove('reverse');
        } else if (dropdownRightX > window.outerWidth) {
            this.dropdown.classList.add('reverse');
        }
    }

    onDropdownSize() {}

    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (
            event.target !== this.iconStatus.nativeElement &&
            event.target !== this.elem.nativeElement
        ) {
            this.is_openStatusDropdown = false;
        }
    }
}
