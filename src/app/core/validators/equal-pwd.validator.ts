import {
    AbstractControl,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';

export function equalPwdValidator(
    formGroup: FormGroup,
    controlName: string
): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const isValid = control.value === formGroup.get(controlName).value;

        return isValid ? null : { passwordsNotMatch: true };
    };
}
