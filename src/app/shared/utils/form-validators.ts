import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Validator that requires the control's value to match a regex pattern.
   */
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        // If control is empty, return no error
        return null;
      }
      
      // Test the value of the control against the regex supplied
      const valid = regex.test(control.value);
      
      // If true, return no error, else return the error passed in the second parameter
      return valid ? null : error;
    };
  }
  
  /**
   * Validator that requires controls to have matching values.
   */
  static matchValidator(
    controlName: string,
    matchingControlName: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);
      
      if (!control || !matchingControl) {
        return null;
      }
      
      if (matchingControl.errors && !matchingControl.errors['matching']) {
        return null;
      }
      
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ matching: true });
        return { matching: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }
}