import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { CustomValidators } from '../../../shared/custom.validators';


@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  empForm: FormGroup;
  // fullNameLength: Number = 0;

  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'E-Mail is required.',
      'emailDomain': 'E-Mail domain should be gmail.com.'
    },
    'confirmEmail': {
      'required': 'Confirm E-Mail is required.'
    },
    'emailGroup': {
      'emailMismatched': 'E-Mail and Confirm E-Mail do not match.'
    },
    'phone': {
      'required': 'Phone is required.'
    }
  };

  formErrors = {
    
  };

  constructor(
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.empForm = this._fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this._fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('gmail.com')]],
        confirmEmail: ['', Validators.required]
      }, { validator: CustomValidators.matchEmail}),
      phone: [''],
      skills: this._fb.array([
        this.addSkillFormGroup()
      ])
    });

    this.empForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.empForm);
    })

    this.empForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onChangeContactPreferece(data);
    })

  }

  addSkillFormGroup() : FormGroup {
    return this._fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  addSkillButtonClick(): void {
    (<FormArray>this.empForm.get('skills')).push(this.addSkillFormGroup());
  }

  removeSkillButtonClick(formGroupIndex: number): void {
    (<FormArray>this.empForm.get('skills')).removeAt(formGroupIndex);
  }

  onChangeContactPreferece(selectedValue: String) {
    const phoneControl = this.empForm.get('phone');
    // const emailControl = this.empForm.get('email');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
      // emailControl.clearValidators();
    } else {
      phoneControl.clearValidators();
      // emailControl.setValidators(Validators.required);
    }
    phoneControl.updateValueAndValidity();
  }

  onSubmit(): void {
    console.log(this.empForm.value)
  }

  loadDataClick(): void {
    console.log(this.empForm.controls)
  }


  logValidationErrors(group: FormGroup = this.empForm): void {
    // console.log(group.controls)
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid && (abstractControl.dirty || abstractControl.touched)) {
          const message = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += message[errorKey];
            }
          }
        }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } 
      
    })
  }

}

