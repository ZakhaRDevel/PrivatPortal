import {
    AbstractControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';

export function allRequiredValidator(formGroup: FormGroup): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let isValid = true;

        Object.keys(formGroup.controls).forEach((key) => {
            if (
                formGroup.get(key).value === null ||
                formGroup.get(key).value === ''
            ) {
                isValid = false;
            }
        });

        return isValid ? null : { allRequiredValidator: true };
    };
}
