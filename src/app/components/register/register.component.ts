import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  userType: string = '';
  displayLoader: boolean = false;
  displayLoaderSubscription!: Subscription;
  specialtyOptions: string[] = ['Dentista', 'Dermatologo'];
  showSpecialtyOptions = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loader: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.displayLoaderSubscription = this.loader.loaderState$.subscribe({
      next: (state) => (this.displayLoader = state),
      error: (err) => console.error(err),
    });

    this.initializeForm();
  }

  onSpecialtyChange(value: string) {
    if (!this.specialtyOptions.includes(value)) {
      this.showSpecialtyOptions = true;
    } else {
      this.showSpecialtyOptions = false;
    }
  }

  onSelectOption(option: string) {
    this.registrationForm.get('specialty')?.setValue(option);
    this.showSpecialtyOptions = false;
  }

  initializeForm() {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(1)]],
      lastName: ['', [Validators.required, Validators.minLength(1)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      userType: ['', Validators.required],
      specialty: [''],
      healthInsurance: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      profileImage1: [''],
      profileImage2: [''],
      profileImage: [''],
    });
  }

  onSubmit() {
    if (this.registrationForm && this.registrationForm.valid) {
      this.loader.show();
      const userObj = this.getUserObject();

      this.authService
        .register(userObj)
        .then(() => {
          this.authService
            .login(userObj.email, userObj.password)
            .then(() => {
              this.loader.hide();
              this.router.navigate(['']);
            })
            .catch((err) => {
              console.error(err);
              this.loader.hide();
            });
        })
        .catch((err) => {
          console.log(err);
          this.loader.hide();
        });

      console.log('Form submitted:', this.registrationForm.value);
    } else {
      console.warn('Form is invalid. Please check the fields.');
    }
  }

  private getUserObject() {
    const userObj = {
      firstName: this.registrationForm.get('firstName')?.value,
      lastName: this.registrationForm.get('lastName')?.value,
      age: this.registrationForm.get('age')?.value,
      dni: this.registrationForm.get('dni')?.value,
      userType: this.registrationForm.get('userType')?.value,
      specialty: this.registrationForm.get('specialty')?.value,
      healthInsurance: this.registrationForm.get('healthInsurance')?.value,
      email: this.registrationForm.get('email')?.value,
      password: this.registrationForm.get('password')?.value,
      profileImage1: this.registrationForm.get('profileImage1')?.value,
      profileImage2: this.registrationForm.get('profileImage2')?.value,
      profileImage: this.registrationForm.get('profileImage')?.value,
    };

    return userObj;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registrationForm?.get(field);
    return control ? control.invalid && control.touched : false;
  }

  onUserTypeChange(event: Event) {
    this.loader.show();
    const value = (event.target as HTMLSelectElement)?.value;

    if (value) {
      this.userType = value;
      this.initializeForm();
      this.registrationForm?.get('userType')?.setValue(value);

      if (value === 'patient') {
        this.registrationForm
          ?.get('healthInsurance')
          ?.setValidators(Validators.required);
        this.registrationForm
          ?.get('profileImage2')
          ?.setValidators(Validators.required);
        this.registrationForm
          ?.get('profileImage1')
          ?.setValidators(Validators.required);
        this.registrationForm?.get('specialty')?.clearValidators();
        this.registrationForm?.get('profileImage')?.clearValidators();
      } else if (value === 'specialist') {
        this.registrationForm
          ?.get('specialty')
          ?.setValidators(Validators.required);
        this.registrationForm?.get('healthInsurance')?.clearValidators();
        this.registrationForm
          ?.get('profileImage')
          ?.setValidators(Validators.required);
        this.registrationForm?.get('profileImage1')?.clearValidators();
        this.registrationForm?.get('profileImage2')?.clearValidators();
      }

      this.registrationForm?.updateValueAndValidity();
      this.loader.hide();
    }
  }
}
