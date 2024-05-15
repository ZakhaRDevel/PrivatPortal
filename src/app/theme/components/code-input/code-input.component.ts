import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { allRequiredValidator } from 'src/app/core/validators/all-required.validator';

@Component({
    selector: 'app-code-input',
    templateUrl: './code-input.component.html',
    styleUrls: ['./code-input.component.scss'],
})
export class CodeInputComponent extends ApiForm implements AfterViewInit {
    @ViewChild('number0') number0: ElementRef;
    @ViewChild('number1') number1: ElementRef;
    @ViewChild('number2') number2: ElementRef;
    @ViewChild('number3') number3: ElementRef;
    @ViewChild('number4') number4: ElementRef;
    @ViewChild('number5') number5: ElementRef;

    @Input() codeError: string = '';
    @Input() isGoogle: boolean;
    @Input() isTelegramCheck: boolean;

    formGroup: FormGroup;

    arrCells: any = [];
    isCopyPaste: boolean;
    сodeCounter: number = null;

    wrongCode: boolean;
    isTyping: boolean;

    get codeGroup(): FormGroup {
        return this.formGroup.get('numberCode') as FormGroup;
    }

    @Output() onSendEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor(private fb: FormBuilder) {
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
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.number0.nativeElement.focus();
        }, 300);
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

    theFieldsAreFloode = () => {
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
                if (this[next]?.nativeElement) {
                    this[next].nativeElement.focus();
                    next = null;
                }
            }, 0);
        }

        setTimeout(() => {
            this.isTyping;
        }, 100);
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

    prepareRequest(): Observable<any> {
        const formData = this.formGroup.getRawValue();

        let code = '';
        Object.values(formData.numberCode).forEach((val) => {
            code += val;
        });

        if (code.length === 6) {
            this.onSendEvent.emit(code);
        }

        return null;
    }
}
