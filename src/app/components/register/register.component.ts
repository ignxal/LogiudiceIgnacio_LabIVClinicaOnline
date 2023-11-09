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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loader: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.displayLoaderSubscription = this.loader.loaderState$.subscribe({
      next: (state) => (this.displayLoader = state),
      error: (err) => console.log(err),
    });

    this.initializeForm();
  }

  initializeForm() {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
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
      const userObj = this.getUserObject();

      this.authService
        .register(userObj)
        .then(() => {
          this.authService
            .login(userObj.email, userObj.password)
            .then(() => {
              this.router.navigate(['/home']);
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });

      console.log('Form submitted:', this.registrationForm.value);
    } else {
      console.log('Form is invalid. Please check the fields.');
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
        this.registrationForm?.get('specialty')?.clearValidators();
        this.registrationForm?.get('profileImage')?.clearValidators();
      } else if (value === 'specialist') {
        this.registrationForm
          ?.get('specialty')
          ?.setValidators(Validators.required);
        this.registrationForm?.get('healthInsurance')?.clearValidators();
        this.registrationForm
          ?.get('profileImage1')
          ?.setValidators(Validators.required);
        this.registrationForm
          ?.get('profileImage2')
          ?.setValidators(Validators.required);
      }

      this.registrationForm?.updateValueAndValidity();
    }
  }
}
