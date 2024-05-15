import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function requiredBooleanValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return control.value === true || control.value === false
            ? null
            : { requiredOne: true };
    };
}
