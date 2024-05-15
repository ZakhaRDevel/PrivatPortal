import {
    AbstractControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';

export function oneRequiredValidator(
    formGroup: FormGroup,
    exceptFields: string[] = []
): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let isValid = false;

        Object.keys(formGroup.controls).forEach((key) => {
            if (!exceptFields.includes(key) && formGroup.get(key).value) {
                isValid = true;
            }
        });

        return isValid ? null : { requiredOneOrMany: true };
    };
}
