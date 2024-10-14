import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nonEmptyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.trim();
        return value ? null : { nonEmpty: true };
    };
}
