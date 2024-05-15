import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import * as moment from 'moment';
@Injectable()
export abstract class Form {
    @Output() sent: EventEmitter<any> = new EventEmitter();
    @Output() sentSuccess: EventEmitter<any> = new EventEmitter();
    @Output() sentFailed: EventEmitter<any> = new EventEmitter();

    protected requestSubscription = new Subscription();
    protected request$: Observable<any> = of([]);

    isSubmitted = false;
    isSent = false;
    isModal = false;

    abstract formGroup: FormGroup;

    abstract prepareRequest(): Observable<any>;

    get input(): { [p: string]: AbstractControl } {
        return this.formGroup.controls;
    }

    submitPrepare() {
        this.formGroup.setErrors(null);
        Object.keys(this.formGroup.getRawValue()).forEach((field) => {
            this.input[field].updateValueAndValidity();
        });
        this.formGroup.markAllAsTouched();
    }

    submit() {
        this.submitPrepare();
        if (this.formGroup.valid) {
            this.isSubmitted = true;
            this.send();
        }
    }

    send() {
        if (this.isSent) {
            return;
        }

        this.request$ = this.prepareRequest();
        this.isSent = true;
        this.requestSubscription = this.request$

            .pipe(finalize(() => this.onRequestFinal()))
            .subscribe(
                (value) => this.onRequestSuccess(value),
                (error) => this.onRequestFailed(error)
            );
    }

    onRequestSuccess(value: any): void {
        this.sentSuccess.emit(value);
        this.formGroup.reset();
    }

    onRequestFailed(errorResponse: HttpErrorResponse): void {
        this.setFormErrors(errorResponse);
        this.sentFailed.emit(this.formGroup.errors);
    }

    onRequestFinal(): void {
        this.isSubmitted = false;
        this.isSent = false;
        this.requestSubscription.unsubscribe();
        this.sent.emit();
    }

    /**
     * Describes how to find validation error keys in object returned by backend
     */
    setFormErrors(errorResponse: HttpErrorResponse) {
        const generalErrors: any = {};

        // Nest Errors Handler
        if (
            errorResponse.error &&
            errorResponse.error.message &&
            errorResponse.error.message.forEach
        ) {
            errorResponse.error.message.forEach((message: any) => {
                message.children.forEach((item: any) => {
                    if (this.formGroup.get(item.property)) {
                        this.input[item.property].setErrors({
                            invalid: true,
                            ...item.constraints,
                        });
                    } else {
                        generalErrors[item.property] = true;
                    }
                });
            });
        }

        // Laravel Errors Handler
        if (errorResponse.error ? errorResponse.error.errors : null) {
            for (const [property, value] of Object.entries(
                errorResponse.error.errors
            )) {
                if (this.formGroup.get(property.toString())) {
                    (value as string[]).forEach((rule) => {
                        this.input[property.toString()].setErrors({
                            [rule]: true,
                        });
                    });
                } else {
                    generalErrors[property.toString()] = true;
                }
            }
        }

        if (
            errorResponse.status === 0 ||
            errorResponse.status === 403 ||
            errorResponse.status === 404 ||
            errorResponse.status >= 500
        ) {
            generalErrors.server = true;
        }

        this.formGroup.setErrors(generalErrors);
    }

    incrementControl(formControlName: string) {
        const control = this.formGroup.get(formControlName);
        if (control) {
            const value = Number(control.value);
            control.setValue(value + 1);
        }
    }

    decrementControl(formControlName: string, unsigned = false) {
        const control = this.formGroup.get(formControlName);
        if (control) {
            const value = Number(control.value);

            if (!unsigned || value > 0) {
                control.setValue(value - 1);
            }
        }
    }

    convertFromNgbDatepicker(dateStruct: any) {
        return dateStruct
            ? moment(
                  ('0000' + dateStruct.year).substr(-4, 4) +
                      '-' +
                      ('00' + dateStruct.month).substr(-2, 2) +
                      '-' +
                      ('00' + dateStruct.day).substr(-2, 2)
              )
            : moment(null);
    }

    convertToNgbDatepicker(date: any) {
        const _date = moment(date);

        return {
            day: Number(_date.format('D')),
            month: Number(_date.format('M')),
            year: Number(_date.format('Y')),
        };
    }
}
