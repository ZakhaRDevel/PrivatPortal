import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'pc-input-select-typed',
    templateUrl: './input-select-typed.component.html',
    styleUrls: ['./input-select-typed.component.scss'],
})
export class InputSelectTypedComponent implements OnInit {
    @Input() items: any[] = [];
    @Input() control: any;
    @Input() isInvalid: boolean;
    @Input() notFoundText: string = '';
    @Input() placeholderSearch: string = '';
    @Input() placeholderSelect: string = '';
    @Input() filters: string[] = ['title', 'code'];

    @Output() onChangeEvent: EventEmitter<void> = new EventEmitter<void>();

    kw: string = '';

    constructor() {}

    ngOnInit(): void {}

    onChange() {
        this.onChangeEvent.emit();
    }
}
