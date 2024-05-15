import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { AuthService } from 'src/app/core/services/auth.service';
import { LangService } from 'src/app/core/services/lang.service';
import { PageModel } from 'src/app/data/models/page.models';
import { AuthModalComponent } from 'src/app/pages/auth/auth-modal/auth-modal.component';
import {CoreService} from "../../../core/services/core.service";

@Component({
    selector: 'app-recovery',
    templateUrl: './recovery.component.html',
    styleUrls: ['../auth.component.scss'],
})
export class RecoveryComponent extends ApiForm implements OnInit {
    page: PageModel;
    pageErrors: PageModel;

    constructor(
        private fb: FormBuilder,
        private matDialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private langService: LangService,
        public coreService: CoreService,
    ) {
        super(
            fb.group({
                email: fb.control('', {
                    validators: [Validators.required, Validators.email],
                }),
                locale: fb.control('en', {
                    validators: [Validators.required],
                }),
            })
        );

        this.reset = false;
    }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.page = data.page;
            this.pageErrors = data.page.errors;
        });
    }

    prepareRequest(): Observable<any> {
        const data = this.formGroup.getRawValue();
        data.locale = this.langService.lang;

        return this.authService.recovery(data);
    }

    onRequestSuccess(value: any): void {
        const dialog = this.matDialog.open(AuthModalComponent, {
            backdropClass: 'form-dialog-backdrop',
            panelClass:'form-dialog-container',
            data: {
                title: this.page.data.modalSuccess.title,
                text: this.page.data.modalSuccess.text,
                img_url: '/assets/img/pages/auth/success.png',
                btn_text: this.page.data.modalSuccess.btn,
            },
        });

        dialog.afterClosed().subscribe(() => {
            this.control('email').setValue('');
        });
    }
}
