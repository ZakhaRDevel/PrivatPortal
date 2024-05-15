import {
    AbstractControl,
    FormControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';

export function equalValidator(equalControl: FormControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const isValid = control.value === equalControl.value;

        return isValid ? null : { passwordsNotMatch: true };
    };
}
