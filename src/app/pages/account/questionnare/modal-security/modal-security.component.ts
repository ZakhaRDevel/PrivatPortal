import { animate, style, transition, trigger } from '@angular/animations';
import {
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { LangService } from 'src/app/core/services/lang.service';
import { allRequiredValidator } from 'src/app/core/validators/all-required.validator';
import { PageModel } from 'src/app/data/models/page.models';
import { UserModel } from 'src/app/data/models/user.model';
import { SecurityService } from 'src/app/data/services/security.service';
import { UserService } from 'src/app/data/services/user.service';

@Component({
    selector: 'app-modal-security',
    templateUrl: './modal-security.component.html',
    styleUrls: ['./modal-security.component.scss'],
    animations: [
        trigger('ModalAnimate', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('500ms', style({ opacity: 1 })),
            ]),
        ]),
    ],
})
export class ModalSecurityComponent /* extends ApiForm */ implements OnInit {
    modalSuccessfully = true;
    modalState: string;
    page: PageModel;
    pageErrors: PageModel;
    me: UserModel;
    tgCodeCounter: number = null;
    phoneCodeCounter: number = null;
    isCopyPaste: boolean;

    @ViewChild('telegramCode1') telegramCode1: ElementRef;
    @ViewChild('telegramCode2') telegramCode2: ElementRef;
    @ViewChild('telegramCode3') telegramCode3: ElementRef;
    @ViewChild('telegramCode4') telegramCode4: ElementRef;
    @ViewChild('telegramCode5') telegramCode5: ElementRef;

    @ViewChild('phoneCode1') phoneCode1: ElementRef;
    @ViewChild('phoneCode2') phoneCode2: ElementRef;
    @ViewChild('phoneCode3') phoneCode3: ElementRef;
    @ViewChild('phoneCode4') phoneCode4: ElementRef;
    @ViewChild('phoneCode5') phoneCode5: ElementRef;

    constructor(
        private matDialogRef: MatDialogRef<ModalSecurityComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            page: PageModel;
        },
        private fb: FormBuilder,
        private router: Router,
        private userService: UserService,
        private securityService: SecurityService,
        private langService: LangService
    ) {
        // super(
        //     fb.group({
        //         telegramCode: fb.group({
        //             telegramCode0: fb.control(null, Validators.required),
        //             telegramCode1: fb.control(null),
        //             telegramCode2: fb.control(null),
        //             telegramCode3: fb.control(null),
        //             telegramCode4: fb.control(null),
        //             telegramCode5: fb.control(null),
        //         }),
        //         phoneCode: fb.group({
        //             phoneCode0: fb.control(null, Validators.required),
        //             phoneCode1: fb.control(null),
        //             phoneCode2: fb.control(null),
        //             phoneCode3: fb.control(null),
        //             phoneCode4: fb.control(null),
        //             phoneCode5: fb.control(null),
        //         }),
        //     }),
        //     false
        // );

        // this.group('telegramCode').addValidators(
        //     allRequiredValidator(this.group('telegramCode'))
        // );

        // this.group('phoneCode').addValidators(
        //     allRequiredValidator(this.group('phoneCode'))
        // );

        // this.group('telegramCode').valueChanges.subscribe((val) => {
        //     setTimeout(() => {
        //         this.handleCodeChange(val);
        //     }, 100);

        //     this.clearError(this.group('telegramCode'), 'telegramCode');
        // });

        // this.group('phoneCode').valueChanges.subscribe((val) => {
        //     setTimeout(() => {
        //         this.handleCodeChange(val);
        //     }, 100);
        //     this.clearError(this.group('phoneCode'), 'phoneCode');
        // });
    }

    // handleCodeChange(val: any) {
    //     let next = null;
    //     Object.keys(val).forEach((key) => {
    //         if (!val[key] && !next) {
    //             next = key;
    //         }
    //     });

    //     if (next && !this.isCopyPaste && this[next]) {
    //         setTimeout(() => {
    //             this[next].nativeElement.focus();
    //             next = null;
    //         }, 0);
    //     }
    // }

    // onPaste(evt: any, group: string) {
    //     this.isCopyPaste = true;
    //     const clipboardData = evt.clipboardData || (<any>window).clipboardData;
    //     let pastedText = clipboardData.getData('text');

    //     if (pastedText && +pastedText > 0) {
    //         pastedText = pastedText.toString();

    //         for (let i = 0; i < pastedText.length; i++) {
    //             this.formGroup
    //                 .get(group)
    //                 .get(`${group}${i}`)
    //                 .setValue(pastedText.charAt(i), { emitEvent: false });
    //         }

    //         this.isCopyPaste = false;
    //     }
    // }

    ngOnInit(): void {}

    // prepareRequest(): Observable<any> {
    //     const formData = this.formGroup.getRawValue();

    //     let tgCode = '';
    //     Object.values(formData.telegramCode).forEach((val) => {
    //         tgCode += val;
    //     });

    //     let phoneCode = '';
    //     Object.values(formData.phoneCode).forEach((val) => {
    //         phoneCode += val;
    //     });

    //     const data = {
    //         phoneCode: phoneCode,
    //         telegramCode: tgCode,
    //     };

    //     return this.securityService.verifyCode(data);
    // }

    // onRequestSuccess(value: any): void {
    //     this.modalSuccessfully = true;
    // }

    // close() {
    //     this.matDialogRef.close();
    // }

    goToDashboard() {
        this.router.navigateByUrl('/acc/dashboard').then(() => {
            this.matDialogRef.close();
        });
    }

    // sendTelegramCode() {
    //     if (this.tgCodeCounter > 0) {
    //         return;
    //     }

    //     this.tgCodeCounter = 120;
    //     const interval = setInterval(() => {
    //         if (this.tgCodeCounter === 0) {
    //             clearInterval(interval);
    //             return;
    //         }
    //         this.tgCodeCounter -= 1;
    //     }, 1000);

    //     this.securityService
    //         .getTelegramCode({ locale: this.langService.lang })
    //         .subscribe((res) => {});
    // }

    // sendphoneCode() {
    //     if (this.phoneCodeCounter > 0) {
    //         return;
    //     }

    //     this.phoneCodeCounter = 120;
    //     const interval = setInterval(() => {
    //         if (this.phoneCodeCounter === 0) {
    //             clearInterval(interval);
    //             return;
    //         }
    //         this.phoneCodeCounter -= 1;
    //     }, 1000);

    //     this.securityService
    //         .getPhoneCode({ locale: this.langService.lang })
    //         .subscribe((res) => {});
    // }
}
