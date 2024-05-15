import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxAmountValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return +control.value <= +max ? null : { maxTickets: true };
    };
}
