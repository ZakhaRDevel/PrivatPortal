import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minSumValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return +control.value > +min ? null : { withdrawMinSum: true };
    };
}
