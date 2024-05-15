import { Injectable, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable()
export abstract class FormInput {
    @Input() abstract control: FormControl | any;

    get errors(): string[] {
        const errors = [];

        if (!this.control) {
            return errors;
        }

        if (this.control.touched && this.control.invalid) {
            Object.keys(this.control.errors).forEach((key: string) => {
                if (this.control.errors[key]) {
                    errors.push(key);
                }
            });
        }

        return errors;
    }
}
