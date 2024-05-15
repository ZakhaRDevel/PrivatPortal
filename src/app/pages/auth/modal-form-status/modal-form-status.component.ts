import {
    animate,
    group,
    query,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { catchError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { PageModel } from 'src/app/data/models/page.models';
import { AuthModalComponent } from 'src/app/pages/auth/auth-modal/auth-modal.component';

@Component({
    selector: 'app-modal-form-status',
    templateUrl: './modal-form-status.component.html',
    styleUrls: ['./modal-form-status.component.scss'],
    animations: [
        trigger('barWindow', [
            state(
                'start',
                style({
                    opacity: '0',
                })
            ),
            state('end', style({ opacity: '1' })),
            transition('start => end', [
                group([
                    animate(500),
                    query('.progress', animate(5000, style({ width: '100%' }))),
                ]),
            ]),
            transition('end => start', animate(500)),
        ]),
        trigger('ModalAnimate', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('500ms', style({ opacity: 1 })),
            ]),
        ]),
    ],
})
export class ModalformstatusComponent implements OnInit {
    barWindowState = 'start';
    @ViewChild('timerMes') timerMes: ElementRef;
    timerVal;
    showMessage = false;
    seconds = 180;

    constructor(
        private matDialogRef: MatDialogRef<ModalformstatusComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            email: string;
            locale: string;
            page: PageModel;
        },
        private matDialog: MatDialog,
        private authService: AuthService
    ) {}

    animateNotification() {
        if (this.barWindowState === 'end') {
            return;
        }

        this.barWindowState = 'end';

        this.authService.resendEmailConfirmation(this.data).subscribe({
            next: (response) => {
                setTimeout(() => {
                    this.barWindowState = 'start';
                }, 5000);

                this.initTimer();
            },
            error: (error) => {
                this.barWindowState = 'start';
            },
        });
    }

    initTimer() {
        this.showMessage = true;
        const timer = setInterval(() => {
            if (this.seconds < 1) {
                this.showMessage = false;
                clearInterval(timer);
            }
            this.seconds -= 1;
        }, 1000);
        this.seconds = 180;
    }

    close() {
        this.matDialogRef.close();
    }

    ngOnInit(): void {}
}
