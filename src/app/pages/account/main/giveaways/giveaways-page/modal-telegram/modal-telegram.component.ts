import {
    AfterViewInit,
    Component,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { CodeInputComponent } from 'src/app/theme/components/code-input/code-input.component';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { Observable } from 'rxjs';
import { GiveawayService } from 'src/app/data/services/giveaway.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/data/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LangService } from 'src/app/core/services/lang.service';
import { PageModel } from 'src/app/data/models/page.models';
import { ClipboardService } from 'ngx-clipboard';

@Component({
    selector: 'app-modal-telegram',
    templateUrl: './modal-telegram.component.html',
    styleUrls: ['./modal-telegram.component.scss'],
})
export class ModalTelegramComponent
    extends ApiForm
    implements OnInit, AfterViewInit
{
    @ViewChild('codeInput') codeInput: CodeInputComponent;

    isCopiedActive = false;

    isSuccessful: boolean = false;

    code: string;

    tgCode: string = '';

    countdown: number = 0;

    get me() {
        return this.authService.currentUser;
    }

    constructor(
        private matDialogRef: MatDialogRef<ModalTelegramComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            type: string;
            giveawayId: number;
            page: PageModel;
            pageErrors: PageModel;
            pageGeneral: PageModel;
        },
        private fb: FormBuilder,
        private giveawayService: GiveawayService,
        private userService: UserService,
        private authService: AuthService,
        private langService: LangService,
        private _clipboardService: ClipboardService
    ) {
        super(
            fb.group({
                giveawayId: fb.control(data.giveawayId, {
                    validators: [Validators.required],
                }),
            }),
            false
        );
    }

    ngOnInit(): void {
        if (!this.me.telegramVerifiedAt) {
            this.checkCode();
        }

        const modalTypeTwoBackdrop = window.document.querySelector<any>(
            '.modalTypeTwoBackdrop'
        );

        if (modalTypeTwoBackdrop?.parentNode) {
            modalTypeTwoBackdrop.parentNode.classList.add('modal-type-two');
        }

        this.matDialogRef.afterClosed().subscribe(() => {
            const cdk = window.document.querySelector<any>(
                '.cdk-overlay-container'
            );

            if (cdk) {
                cdk.classList.remove('modal-type-two');
            }
        });
    }
    ngAfterViewInit(): void {}

    prepareRequest(): Observable<any> {
        const data = this.formGroup.getRawValue();
        data.giveawayId = +data.giveawayId;
        data['code'] = this.code;

        return this.giveawayService.verifyTelegram(data);
    }

    onRequestSuccess(value: any): void {
        this.isSuccessful = true;
        if (!this.me.telegramVerifiedAt) {
            this.authService.currentUser.telegramVerifiedAt =
                'telegramVerifiedAt';
        }
    }

    onRequestFailed(errorResponse: HttpErrorResponse): void {
        this.codeInput.wrongCode = true;
    }

    modalClose() {
        setTimeout(() => {
            if (this.isSuccessful) {
                this.matDialogRef.close({
                    isSuccessful: true,
                    type: this.data.type,
                });
            } else {
                this.matDialogRef.close();
            }
        }, 300);
    }

    getCode() {
        this.codeInput.submit();
    }

    setCode(code: string) {
        this.code = code;

        this.submit();
    }

    initCountdown() {
        this.countdown = 30;

        const interval = setInterval(() => {
            if (this.countdown > 0) {
                this.countdown--;
            } else {
                clearInterval(interval);
            }
        }, 1000);
    }

    generateCode() {
        if (this.countdown <= 0) {
            this.initCountdown();
        } else {
            return;
        }

        this.userService.getTelegramCode(true).subscribe((response) => {});
    }

    checkCode() {
        this.userService.getTelegramCode().subscribe((response) => {
            const code = response['res'];

            if (code !== 'success') {
                this.tgCode = code;
            } else {
                this.isSuccessful = true;
                this.authService.currentUser.telegramVerifiedAt =
                    'telegramVerifiedAt';
            }
        });
    }

    copyString(text: string) {
        this._clipboardService.copy(text);
        this.isCopiedActive = true;
        setTimeout(() => (this.isCopiedActive = false), 2000);
    }
}
