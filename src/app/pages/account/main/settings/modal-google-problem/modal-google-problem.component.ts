import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckScreenSizeService } from 'src/app/core/services/check-screen-size.service';
import { PageModel } from 'src/app/data/models/page.models';

@Component({
    selector: 'app-modal-google-problem',
    templateUrl: './modal-google-problem.component.html',
    styleUrls: ['./modal-google-problem.component.scss'],
})
export class ModalGoogleProblemComponent implements OnInit {
    get link() {
        return `<a href="https://t.me/privatclub_tech" target='${
            this.isMobile ? '_self' : '_blank '
        }'>${this.data.page.data.modalHelp.link}</a>`;
    }
    isMobile: boolean;
    constructor(
        private matDialogRef: MatDialogRef<ModalGoogleProblemComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            page: PageModel;
        },
        private checkScreenSizeService: CheckScreenSizeService
    ) {}

    ngOnInit(): void {
        window.document
            .querySelector<any>('.modalTypeTwoBackdrop')
            .parentNode.classList.add('modal-type-two');
        this.matDialogRef.afterClosed().subscribe(() => {
            window.document
                .querySelector<any>('.cdk-overlay-container')
                .classList.remove('modal-type-two');
        });

        this.isMobile = this.checkScreenSizeService.isMobile;
    }
    modalClose() {
        this.matDialogRef.close();
    }
}
