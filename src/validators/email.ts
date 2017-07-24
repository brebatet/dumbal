import { FormControl } from '@angular/forms';

export class EmailValidator {

    static isValid(control: FormControl) {
        const re = /^[0-9a-zA-Z_.-]+@[a-zA-Z_.]+?\.[a-zA-Z]{2,3}$/.test(control.value);

        if (re) {
            return null;
        }

        return {
            "invalidEmail": true
        };

    }
}