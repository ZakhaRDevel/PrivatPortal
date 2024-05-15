import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-btn-copy',
    templateUrl: './btn-copy.component.html',
    styleUrls: ['./btn-copy.component.scss'],
})
export class BtnCopyComponent implements OnInit {
    @Input() copyText: string;
    @Input() copyId: string;
    @Input() type: string = 'type_1';
    @Input() copyStr: string = '';
    @Input() copiedStr: string = '';
    @Output() copyEvent: EventEmitter<string> = new EventEmitter<string>();

    timeout: any = null;

    constructor() {}

    ngOnInit(): void {}

    copy(id) {
        clearTimeout(this.timeout);
        const copied = document
            .getElementById(id)
            .getElementsByTagName('aside')[0];
        // this.copyEvent.emit();
        copied.classList.remove('copy-hidden');
        this.timeout = setTimeout(() => {
            copied.classList.add('copy-hidden');
        }, 3000);
    }
}
