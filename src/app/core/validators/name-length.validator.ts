import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nameLengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const REGEX = /^.{1,20}$/;

        return REGEX.test(control.value) ? null : { nameLength: true };
    };
}
