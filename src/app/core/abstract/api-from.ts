import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import {
    EventEmitter,
    Inject,
    Injectable,
    OnDestroy,
    Output,
} from '@angular/core';

@Injectable()
export abstract class ApiForm implements OnDestroy {
    @Output() sentSuccess: EventEmitter<any> = new EventEmitter();
    @Output() sentFailed: EventEmitter<any> = new EventEmitter();

    protected requestSubscription = new Subscription();
    protected request$: Observable<any>;

    isSubmitted = false;
    isSending = false;
    reset = true;
    btnSubmitted: boolean = false;

    formGroup: FormGroup;
    abstract prepareRequest(): Observable<any>;

    errorsCodes: any = {};
    errorObservers: Subscription[] = [];

    constructor(formGroup: FormGroup, @Inject(Boolean) observeErrors = true) {
        this.formGroup = formGroup;
        this.prepareErrors();
        if (observeErrors) {
            this.observeErrors(this.formGroup);
        }
    }

    ngOnDestroy(): void {
        this.clearErrorObservers();
    }

    errors(field: string): string[] {
        return this.errorsCodes[field]?.length ? this.errorsCodes[field] : [];
    }

    control(key: string, parent?: string): FormControl {
        const control = parent
            ? this.formGroup.get(parent).get(key)
            : this.formGroup.get(key);
        return control as FormControl;
    }

    group(key: string, parent?: string): FormGroup {
        const control = parent
            ? this.formGroup.get(parent).get(key)
            : this.formGroup.get(key);
        return control as FormGroup;
    }

    hasValue(control: FormControl): boolean {
        return !!control.value;
    }

    clear(control: FormControl) {
        control.setValue('');
    }

    hideErrors(control: FormControl) {
        const controlName = this.getControlName(control);
        this.errorsCodes[controlName] = [];
    }

    getControlName(control: FormGroup | FormControl): string {
        let controlName = null;
        const parentGroup = control.parent;
        Object.keys(parentGroup.controls).forEach((key: string) => {
            if (parentGroup.get(key) === control) {
                controlName = key;
            }
        });

        return controlName;
    }

    hideAllErrors() {
        Object.keys(this.errorsCodes).forEach((key) => {
            this.errorsCodes[key] = [];
        });
    }

    hasError(control: FormControl): boolean {
        const controlName = this.getControlName(control);
        return this.errorsCodes[controlName]?.length && this.btnSubmitted;
    }

    setFormValues(formGroup: FormGroup, data: any) {
        Object.keys(formGroup.controls).forEach((key) => {
            if (formGroup.get(key) instanceof FormGroup) {
                this.setFormValues(formGroup.get(key) as FormGroup, data[key]);
            } else if (data[key] !== null) {
                formGroup.get(key).setValue(data[key]);
            }
        });
    }

    prepareErrors(
        formGroup: FormGroup = this.formGroup,
        field: string = 'formGroup'
    ) {
        this.errorsCodes[field] = [];

        Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);

            if (control instanceof FormGroup) {
                this.prepareErrors(control as FormGroup, key);
            } else {
                this.errorsCodes[key] = [];
            }
        });
    }

    syncErrors(
        formGroup: FormGroup = this.formGroup,
        name: string = 'formGroup'
    ) {
        if (name === 'formGroup') {
            this.prepareErrors();
        }

        if (formGroup.errors) {
            Object.keys(formGroup.errors).forEach((error) => {
                this.errorsCodes[name].push(error);
            });
        }

        Object.keys(formGroup.controls).forEach((field) => {
            const control = formGroup.get(field);
            if (control instanceof FormGroup) {
                this.syncErrors(control as FormGroup, field);
            } else if (control.errors) {
                Object.keys(control.errors).forEach((error) => {
                    this.errorsCodes[field].push(error);
                });
            }
        });
    }

    clearError(control: FormGroup | FormControl, name?: string) {
        if (!name) {
            name = this.getControlName(control);
        }

        this.errorsCodes[name] = [];
    }

    submit() {
        this.btnSubmitted = true;
        if (this.formGroup.valid) {
            this.isSubmitted = true;
            this.send();
        } else {
            this.syncErrors();
            this.scrollToFirstInvalidControl();
        }
    }

    scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = document.querySelector(
            'form input.ng-invalid'
        );

        if (firstInvalidControl) {
            window.scrollTo(0, this.getTopOffset(firstInvalidControl));
            firstInvalidControl.focus();
        }
    }

    getTopOffset(controlEl: HTMLElement): number {
        const labelOffset = 70;

        if (controlEl?.getBoundingClientRect()?.top) {
            return (
                controlEl.getBoundingClientRect().top +
                window.scrollY -
                labelOffset
            );
        }

        return 0;
    }

    send() {
        if (this.isSending) {
            return;
        }

        this.request$ = this.prepareRequest();

        if (this.request$ !== null) {
            this.isSending = true;
            this.requestSubscription = this.request$
                .pipe(finalize(() => this.onRequestFinal()))
                .subscribe({
                    next: (response) => this.onRequestSuccess(response),
                    error: (error) => this.onRequestFailed(error),
                });
        } else {
            this.btnSubmitted = true;
            this.isSending = false;
            this.isSubmitted = false;

        }
    }

    onRequestSuccess(value): void {
        this.sentSuccess.emit(value);
        if (this.reset) {
            this.formGroup.reset();
            this.btnSubmitted = false;
        }
    }

    onRequestFailed(errorResponse: HttpErrorResponse): void {
        this.setFormErrors(errorResponse);
        this.sentFailed.emit();
    }

    onRequestFinal(): void {
        this.isSubmitted = false;
        this.isSending = false;
        this.requestSubscription.unsubscribe();
    }

    setFormErrors(errorResponse: HttpErrorResponse) {
        this.syncErrors();
        if (errorResponse.error.message) {
            if (Array.isArray(errorResponse.error.message)) {
                for (const error of errorResponse.error.message) {
                    Object.values(error.constraints).forEach((val: string) => {
                        this.errorsCodes[error.property].push(val);
                    });
                }
            }
        }
    }

    clearErrorObservers() {
        for (const observer of this.errorObservers) {
            observer.unsubscribe();
            this.errorObservers.shift();
        }
    }

    observeErrors(formGroup: FormGroup, name: string = 'formGroup') {
        this.errorObservers.push(
            formGroup.valueChanges.subscribe(() => {
                this.errorsCodes[name] = [];
            })
        );

        Object.keys(formGroup.controls).forEach((key) => {
            if (formGroup.get(key) instanceof FormGroup) {
                this.observeErrors(formGroup.get(key) as FormGroup, key);
            } else {
                this.errorObservers.push(
                    formGroup.get(key).valueChanges.subscribe(() => {
                        this.errorsCodes[key] = [];
                    })
                );
            }
        });
    }
}
