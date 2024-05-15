import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { animate, style, transition, trigger } from '@angular/animations';
import { ApiForm } from '../../../../../core/abstract/api-from';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { allRequiredValidator } from '../../../../../core/validators/all-required.validator';
import { SecurityService } from '../../../../../data/services/security.service';
import { LangService } from '../../../../../core/services/lang.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import QRCode from 'qrcode';
import { HttpErrorResponse } from '@angular/common/http';
import { PageModel } from 'src/app/data/models/page.models';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
    selector: 'app-modal-google',
    templateUrl: './modal-google.component.html',
    styleUrls: ['./modal-google.component.scss'],
})
export class ModalGoogleComponent
    extends ApiForm
    implements OnInit, AfterViewInit
{
    @ViewChild('number0') number0: ElementRef;
    @ViewChild('number1') number1: ElementRef;
    @ViewChild('number2') number2: ElementRef;
    @ViewChild('number3') number3: ElementRef;
    @ViewChild('number4') number4: ElementRef;
    @ViewChild('number5') number5: ElementRef;

    googleData = {
        code: null,
        image: null,
    };

    arrCells: any = [];
    isCopyPaste: boolean;
    сodeCounter: number = null;

    wrongCode: boolean;
    isTyping: boolean;

    get codeGroup(): FormGroup {
        return this.formGroup.get('numberCode') as FormGroup;
    }

    constructor(
        private matDialogRef: MatDialogRef<ModalGoogleComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            page: PageModel;
            pageErrors: PageModel;
        },
        private fb: FormBuilder,
        private securityService: SecurityService,
        private langService: LangService,
        private authService: AuthService,
        public coreService: CoreService
    ) {
        super(
            fb.group({
                numberCode: fb.group({
                    number0: fb.control(null, Validators.required),
                    number1: fb.control(null),
                    number2: fb.control(null),
                    number3: fb.control(null),
                    number4: fb.control(null),
                    number5: fb.control(null),
                }),
            }),
            false
        );

        this.reset = false;

        this.group('numberCode').addValidators(
            allRequiredValidator(this.group('numberCode'))
        );

        this.group('numberCode').valueChanges.subscribe((val) => {
            setTimeout(() => {
                this.handleCodeChange(val);
            }, 100);

            this.wrongCode = false;
            this.clearError(this.control('numberCode'));
        });
    }

    ngOnInit(): void {
        this.authService.generate2FA().subscribe(async (res) => {
            const qr = await QRCode.toDataURL(res);

            this.googleData.code = res.split('secret=')[1].split('&')[0];
            this.googleData.image = qr;
        });

        window.document
            .querySelector<any>('.modalTypeTwoBackdrop')
            .parentNode.classList.add('modal-type-two');
        this.matDialogRef.afterClosed().subscribe(() => {
            window.document
                .querySelector<any>('.cdk-overlay-container')
                .classList.remove('modal-type-two');
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.number0.nativeElement.focus();
        }, 300);
    }

    modalClose() {
        this.matDialogRef.close();
    }

    prepareRequest(): Observable<any> {
        const formData = this.formGroup.getRawValue();

        let code = '';
        Object.values(formData.numberCode).forEach((val) => {
            code += val;
        });

        const data = {
            code,
        };

        return this.authService.verify2FA(data);
    }

    onRequestSuccess(value: any): void {
        super.onRequestSuccess(value);

        this.wrongCode = !value;

        if (!this.wrongCode) {
            this.matDialogRef.close({ userSecurity: { googleEnabled: true } });
        }
    }

    onRequestFailed(errorResponse: HttpErrorResponse): void {
        super.onRequestFailed(errorResponse);
    }

    handleCodeChange(val: any) {
        let next = null;
        this.isTyping = true;
        Object.keys(val).forEach((key) => {
            if (!val[key] && !next) {
                next = key;
            }
        });

        if (next && !this.isCopyPaste && this[next]) {
            setTimeout(() => {
                this[next].nativeElement.focus();
                next = null;
            }, 0);
        }
    }

    onPaste(evt: any, group: string) {
        this.isCopyPaste = true;
        const clipboardData = evt.clipboardData || (<any>window).clipboardData;
        let pastedText = clipboardData.getData('text');

        if (pastedText && +pastedText > 0) {
            pastedText = pastedText.toString();

            for (let i = 0; i < pastedText.length; i++) {
                this.codeGroup
                    .get(`number${i}`)
                    .setValue(pastedText.charAt(i), { emitEvent: false });
            }

            this.isCopyPaste = false;
        }
    }

    handleDelete(evt: any, el) {
        const key = evt.keyCode || evt.charCode;
        if (key == 8 || key == 46) {
            if (this.codeGroup.get('number' + el).value) {
                this.codeGroup.get('number' + el).setValue(null);
            } else if (this.codeGroup.get('number' + el) && el > 0) {
                this.codeGroup.get('number' + (el - 1)).setValue(null);
            }
        }
    }

    onFocus(el) {
        if (el.value) {
            el.focus();
        } else {
            if (!this.codeGroup.get('number0').value) {
                this.number0.nativeElement.focus();
            } else if (!this.codeGroup.get('number1').value) {
                this.number1.nativeElement.focus();
            } else if (!this.codeGroup.get('number2').value) {
                this.number2.nativeElement.focus();
            } else if (!this.codeGroup.get('number3').value) {
                this.number3.nativeElement.focus();
            } else if (!this.codeGroup.get('number4').value) {
                this.number4.nativeElement.focus();
            } else if (!this.codeGroup.get('number5').value) {
                this.number5.nativeElement.focus();
            }
        }
    }

    theFieldsAreFloode = (): boolean => {
        return (
            this.codeGroup.get('number5').value &&
            this.codeGroup.get('number4').value &&
            this.codeGroup.get('number3').value &&
            this.codeGroup.get('number2').value &&
            this.codeGroup.get('number1').value &&
            this.codeGroup.get('number0').value
        );
    };

    onInputSubmit() {
        if (this.theFieldsAreFloode()) {
            this.submit();
        }
    }

    sendCode() {
        if (this.сodeCounter > 0) {
            return;
        }

        this.сodeCounter = 120;
        const interval = setInterval(() => {
            if (this.сodeCounter === 0) {
                clearInterval(interval);
                return;
            }
            this.сodeCounter -= 1;
        }, 1000);

        this.securityService
            .getTelegramCode({ locale: this.langService.lang })
            .subscribe((res) => {});
    }
}
