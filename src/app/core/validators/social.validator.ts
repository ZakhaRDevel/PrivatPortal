import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function socialValidator(prefix: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        // const REGEX = /^[A-Za-z0-9]+$/i;

        // if (!REGEX.test(control.value) || !control.value?.length) {
        //     return { [`wrongSocial`]: true };
        // }

        // return null;

        let isValid = false;
        try {
            if (control.value) {
                let value = control.value.toString();
                value =
                    value.substring(0, prefix.length) === prefix
                        ? value
                        : prefix;
                value = `${value.substring(0, prefix.length)}${value
                    .substring(prefix.length)
                    .replace(prefix, '')}`;
                control.setValue(value);

                if (control.value === prefix) {
                    return { [`wrongSocial`]: true };
                }
            }
            isValid = true;
        } catch (e) {
            return { required: true };
        }

        return isValid ? null : { [`wrongSocial`]: true };
    };
}
