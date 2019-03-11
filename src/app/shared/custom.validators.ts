import { AbstractControl } from "@angular/forms";




export class CustomValidators {
    static emailDomain(domain: String) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const email: String = control.value;
            const controlDomain = email.substring(email.lastIndexOf('@') + 1);
            if (email === '' || controlDomain.toLowerCase() === domain.toLowerCase()) {
                return null;
            } else {
                return { 'emailDomain': true };
            }
        };
    }
    
    static matchEmail(group: AbstractControl) : { [key: string]: any} | null {
        const emailControl = group.get('email');
        const confirmEmailControl = group.get('confirmEmail');
        if((emailControl.value === confirmEmailControl.value) || confirmEmailControl.pristine) {
            return null;
        } else {
            return {'emailMismatched': true}
        }
      }
}