import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { allRequiredValidator } from 'src/app/core/validators/all-required.validator';
import { Observable } from 'rxjs';
import { SecurityService } from '../../../data/services/security.service';
import { LangService } from '../../../core/services/lang.service';

@Component({
    selector: 'app-input-pincode',
    templateUrl: './input-pincode.component.html',
    styleUrls: ['./input-pincode.component.scss'],
})
export class InputPincodeComponent extends ApiForm implements OnInit {
    @ViewChild('number0') number0: ElementRef;
    @ViewChild('number1') number1: ElementRef;
    @ViewChild('number2') number2: ElementRef;
    @ViewChild('number3') number3: ElementRef;
    @ViewChild('number4') number4: ElementRef;
    @ViewChild('number5') number5: ElementRef;

    numberOfCells: number = 6;

    arrCells: any = [];
    isCopyPaste: boolean;
    tgCodeCounter: number = null;

    constructor(
        private fb: FormBuilder,
        private securityService: SecurityService,
        private langService: LangService
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

        this.group('numberCode').addValidators(
            allRequiredValidator(this.group('numberCode'))
        );

        this.group('numberCode').valueChanges.subscribe((val) => {
            setTimeout(() => {
                this.handleCodeChange(val);
            }, 100);

            this.clearError(this.group('numberCode'), 'numberCode');
        });
    }

    ngOnInit(): void {}
    prepareRequest(): Observable<any> {
        const formData = this.formGroup.getRawValue();

        let tgCode = '';
        Object.values(formData.numberCode).forEach((val) => {
            tgCode += val;
        });

        let phoneCode = '';
        Object.values(formData.phoneCode).forEach((val) => {
            phoneCode += val;
        });

        const data = {
            phoneCode: phoneCode,
            telegramCode: tgCode,
        };

        return this.securityService.verifyCode(data);
    }

    onRequestSuccess(value: any): void {}

    handleCodeChange(val: any) {
        let next = null;
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
                this.formGroup
                    .get(group)
                    .get(`${group}${i}`)
                    .setValue(pastedText.charAt(i), { emitEvent: false });
            }

            this.isCopyPaste = false;
        }
    }

    sendTelegramCode() {
        if (this.tgCodeCounter > 0) {
            return;
        }

        this.tgCodeCounter = 120;
        const interval = setInterval(() => {
            if (this.tgCodeCounter === 0) {
                clearInterval(interval);
                return;
            }
            this.tgCodeCounter -= 1;
        }, 1000);

        this.securityService
            .getTelegramCode({ locale: this.langService.lang })
            .subscribe((res) => {});
    }
}
