import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function telegramValidator(key: string = 'telegram'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const REGEX = new RegExp('^[A-Za-z][A-Za-z0-9_]*[A-Za-z0-9]{1,}$');

        return REGEX.test(control.value) ? null : { telegramSetting: true };
    };
}
