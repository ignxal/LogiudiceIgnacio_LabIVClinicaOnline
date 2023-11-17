import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserM } from '../../../models/user';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SpecialtyService } from 'src/app/services/specialty.service';
import { LoaderService } from 'src/app/services/loader.service';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register-specialist.component.html',
  styleUrls: ['./register-specialist.component.scss'],
})
export class RegisterSpecialistComponent implements OnInit {
  registroForm!: FormGroup;
  tipo: string = '';
  titulo: string = 'Registro';
  especialidades: string[] = [];
  especialidadesSub!: Subscription;
  captcha: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private usuariosService: UserService,
    private loader: LoaderService,
    private router: Router,
    private especialidadesService: SpecialtyService
  ) {}

  ngOnInit() {
    this.registroForm = new FormGroup(
      {
        nombre: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]+$'),
        ]),
        apellido: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]+$'),
        ]),
        edad: new FormControl('', [
          Validators.required,
          Validators.min(0),
          Validators.max(200),
        ]),
        dni: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(9),
        ]),
        especialidad: new FormControl(''),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        password2: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        perfil: new FormControl('', [
          Validators.required,
          Validators.nullValidator,
        ]),
      },
      this.confirmarContraseñaValidator()
    );

    this.especialidadesSub = this.especialidadesService
      .getAll()
      .subscribe((especialidades) => {
        this.especialidades = especialidades.map(
          (especialidad) => especialidad.nombre
        );
        console.log(this.especialidades);
      });
  }

  get perfil() {
    return this.registroForm.get('perfil');
  }

  get password() {
    return this.registroForm.get('password');
  }
  get password2() {
    return this.registroForm.get('password2');
  }
  get email() {
    return this.registroForm.get('email');
  }
  get nombre() {
    return this.registroForm.get('nombre');
  }
  get apellido() {
    return this.registroForm.get('apellido');
  }
  get tipoUsuario() {
    return this.registroForm.get('tipo');
  }
  get edad() {
    return this.registroForm.get('edad');
  }
  get dni() {
    return this.registroForm.get('dni');
  }

  get especialidad() {
    return this.registroForm.get('especialidad');
  }

  submitForm() {
    this.registroForm.markAllAsTouched();

    if (!this.captcha) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro!',
        text: 'Reintenta el ingreso del captcha',
      });
      return;
    }

    if (this.registroForm.valid) {
      this.loader.show();
      let contraseña = this.password?.value;
      let usuario = this.armarUsuario();
      this.auth
        .RegistrarUsuario(usuario, contraseña)
        .then((result) => {
          this.registroExistoso(result);
          this.loader.hide();
        })
        .catch((e) => {
          this.loader.hide();
          console.log(e);
        });
      return;
    }
  }

  armarUsuario(): UserM {
    return {
      uid: '',
      id_user: '',
      email: this.email?.value,
      nombre: this.nombre?.value,
      apellido: this.apellido?.value,
      documento: this.dni?.value,
      edad: this.edad?.value,
      fotos: [this.perfil?.value],
      role: 'Specialist',
      obraSocial: '',
      especialidad: this.especialidad?.value,
      status: 'Habilitado',
      emailVerified: false,
      approved: false,
      registerDate: Timestamp.now(),
      confirmationDate: null,
    };
  }

  registroExistoso(result: { result: boolean; error: string }) {
    if (result.result) {
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso!',
        text: 'Redirigiendo al inicio...',

        timer: 1500,
      }).then((r) => {
        this.auth.enviarConfirmarCorreo();

        this.limpiarFormulario();
        this.router.navigate(['']);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro!',
        text: result.error,
      });
    }
  }

  async addEspecialidad() {
    let especialidad: string = '';
    const inputValue = especialidad;
    const { value: especialidadInput } = await Swal.fire({
      title: 'Nueva especialidad',
      input: 'text',
      inputLabel: 'Ingrese una nueva especialidad:',
      inputValue,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Cargar',
      inputValidator: (value) => {
        if (!value) return 'Escribe algo!';

        if (this.especialidades.indexOf(value) !== -1)
          return 'La especialidad ya existe!';

        return '';
      },
    });
    if (especialidadInput) {
      this.especialidadesService.addOne(especialidadInput).then(() => {
        Swal.fire(`Nueva especialidad agregada: ${especialidadInput}`);
        this.especialidad?.setValue(especialidadInput);
      });
    }
  }

  handleFileInput(event: any, input: string) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const base64String = e.target.result;
      this.registroForm.get(input)?.setValue(base64String);
    };

    reader.readAsDataURL(file);
  }

  limpiarFormulario() {
    this.registroForm.reset();

    this.perfil?.setValue('');
    this.nombre?.setValue('');
    this.apellido?.setValue('');
    this.edad?.setValue('');
    this.dni?.setValue('');
    this.especialidad?.setValue('');
    this.email?.setValue('');
    this.password?.setValue('');
    this.tipoUsuario?.setValue('');
  }
  captchaResult(result: any) {
    this.captcha = result;
  }

  private confirmarContraseñaValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const clave = formGroup.get('password');
      const repiteClave = formGroup.get('password2');
      const respuestaError = { noCoincide: 'La contraseña no coincide' };

      if (clave?.value !== repiteClave?.value) {
        formGroup.get('password2')?.setErrors(respuestaError);
        return respuestaError;
      } else {
        formGroup.get('password2')?.valid;
        return null;
      }
    };
  }
}