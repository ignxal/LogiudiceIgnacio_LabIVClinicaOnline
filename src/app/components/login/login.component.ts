import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Roles } from '../../models/roles';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  selectedUser: any;
  usuarios: {
    role: Roles;
    email: string;
    nombreCompleto: string;
    contraseña: string;
  }[] = [
    {
      role: 'Patient',
      email: 'lelelapancha@patient.com',
      nombreCompleto: 'Lele Lapancha',
      contraseña: '123456',
    },
    {
      role: 'Patient',
      email: 'lelelapata@patient.com',
      nombreCompleto: 'Lele Lapata',
      contraseña: '123456',
    },
    {
      role: 'Patient',
      email: 'lelelapie@patient.com',
      nombreCompleto: 'Lele Lapie',
      contraseña: '123456',
    },
    {
      role: 'Specialist',
      email: 'deslelelapata@specialist.com',
      nombreCompleto: 'Deslele Lapata',
      contraseña: '12345678',
    },
    {
      role: 'Specialist',
      email: 'lelelapancha@specialist.com',
      nombreCompleto: 'Deslele Lapancha',
      contraseña: '12345678',
    },
    {
      role: 'Admin',
      email: 'admin@admin.com',
      nombreCompleto: 'Administrador',
      contraseña: '123456',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private loader: LoaderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submitForm() {
    this.loader.show();
    this.auth
      .IniciarSesion(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      )
      .then((result) => {
        this.loader.hide();
        if (result.result) {
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesion exitoso!',
            text: 'Redirigiendo al inicio...',
            timer: 1500,
            didDestroy: () => {
              this.limpiarFormulario();
              this.router.navigate(['']);
            },
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error en el inicio de sesion!',
            text: result.error,
          });
          this.limpiarFormulario();
        }
      });
  }

  limpiarFormulario() {
    this.loginForm.get('email')?.setValue('');
    this.loginForm.get('password')?.setValue('');
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.loginForm.patchValue({
      email: user.email,
      password: user.contraseña,
    });
  }

  getImagen(role: Roles) {
    switch (role) {
      case 'Admin':
        return 'assets/register/admin.png';
      case 'Specialist':
        return 'assets/register/specialist.png';
      case 'Patient':
        return 'assets/register/patient.png';
    }
  }
}
