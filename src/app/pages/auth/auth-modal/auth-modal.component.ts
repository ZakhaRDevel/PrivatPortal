import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-auth-modal',
    templateUrl: './auth-modal.component.html',
    styleUrls: ['./auth-modal.component.scss'],
    animations: [
        trigger('ModalAnimate', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('500ms', style({ opacity: 1 })),
            ]),
        ]),
    ],
})
export class AuthModalComponent implements OnInit {
    constructor(
        private matDialogRef: MatDialogRef<AuthModalComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            title: string;
            text: string;
            img_url: string;
            btn_text: string;
            btn_link: string;
        }
    ) {}

    close() {
        this.matDialogRef.close();
    }
    ngOnInit(): void {}
}
