import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function telegramLengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const REGEX = /^.{5,32}$/;

        return REGEX.test(control.value) ? null : { telegramLength: true };
    };
}
