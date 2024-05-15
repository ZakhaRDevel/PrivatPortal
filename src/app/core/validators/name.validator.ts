import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const REGEX = /^[-'A-Za-z0-9_\u4e00-\u9eff]{1,}$/i;

        return REGEX.test(control.value) ? null : { name: true };
    };
}
