import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-scroll-up',
    templateUrl: './scroll-up.component.html',
    styleUrls: ['./scroll-up.component.scss'],
})
export class ScrollUpComponent implements OnInit {
    @Input() showScrollBtn: boolean = false;

    constructor() {}

    ngOnInit(): void {}

    triggerScrollTo() {
        const header = document.getElementById('header');
        header.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
}
