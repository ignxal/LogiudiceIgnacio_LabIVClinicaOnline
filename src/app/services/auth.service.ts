import { EventEmitter, Injectable } from '@angular/core';
import {
  Auth,
  User,
  applyActionCode,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';

import { Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserM } from '../models/user';
import { UserService } from './user.service';
import { FilesService } from './file.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usuarioLogueado!: UserM | undefined;
  onUserLogged: EventEmitter<UserM> = new EventEmitter<UserM>();
  onUserLogout: EventEmitter<void> = new EventEmitter<void>();
  private userCredential!: User;

  constructor(
    private usuariosService: UserService,
    private fileService: FilesService,
    private auth: Auth,
    private router: Router
  ) {
    this.getUserFromStorage();
  }

  async registerUser(
    usuario: UserM,
    password: string,
    fotos: File[] | null
  ): Promise<{ result: boolean; error: string }> {
    try {
      usuario.registerDate = Timestamp.now();
      if (usuario.role === 'Admin') usuario.emailVerified = true;

      const exists = await this.usuariosService.exists(usuario);

      if (exists) {
        return { result: false, error: 'La persona ya existe' };
      }

      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        usuario.email,
        password
      );

      this.userCredential = userCredential.user;
      usuario.uid = userCredential.user.uid;

      const picturesURL: any = await this.fileService.updateImages(
        usuario.email,
        fotos
      );

      await updateProfile(this.auth.currentUser!, {
        displayName: usuario.nombre + ' ' + usuario.apellido,
        photoURL: picturesURL[0],
      });

      usuario.photoURL = picturesURL[0];
      usuario.imageUrl = [...picturesURL];

      await this.usuariosService.addOne(usuario);

      return { result: true, error: '' };
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-email':
          return { result: false, error: 'Correo electrónico invalido' };
        case 'auth/email-already-in-use':
          return { result: false, error: 'Correo electrónico ya registrado' };
        case 'auth/invalid-password':
          return { result: false, error: 'Contraseña debil' };
        default:
          return { result: false, error: 'Error al registrarse' };
      }
    }
  }

  sendMailConfirmation() {
    sendEmailVerification(this.userCredential);
  }

  async activateAccount(oobCode: string) {
    await applyActionCode(this.auth, oobCode);

    this.usuariosService.getOne(this.auth.currentUser!.uid).then((user) => {
      user.emailVerified = true;
      user.registerDate = Timestamp.now();

      this.usuariosService.update(user);

      Swal.fire({
        icon: 'success',
        title: 'Verificación exitosa!',
        text: 'Redirigiendo al inicio de sesion!',
        timer: 1500,
      })
        .then(() => {
          this.router.navigate(['/login']);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  async loginUser(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return this.usuariosService
        .getOne(userCredential.user.uid)
        .then((user) => {
          if (user.emailVerified) {
            if (
              user.role !== 'Specialist' ||
              (user.role === 'Specialist' && user.status === 'Habilitado')
            ) {
              this.usuarioLogueado = user;
              this.setUserToStorage();

              return { result: true, error: '' };
            } else {
              return { result: false, error: 'El usuario no esta habilitado' };
            }
          } else {
            return {
              result: false,
              error: 'Primero debe confirmar su correo electrónico',
            };
          }
        });
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-email':
          return {
            result: false,
            error: 'Correo electrónico o contraseña incorrecta',
          };
        default:
          return { result: false, error: 'Error al iniciar sesion' };
      }
    }
  }

  async logoutUser() {
    try {
      await signOut(this.auth);
      this.usuarioLogueado = undefined;
      this.deleteUserFromStorage();
      return { result: true, error: '' };
    } catch (error) {
      return { result: false, error: 'Error al cerrar sesion' };
    }
  }

  getUserFromStorage() {
    if (this.usuarioLogueado === undefined) {
      try {
        const user = JSON.parse(
          localStorage.getItem('currentUser') || undefined!
        );
        if (user) {
          this.usuarioLogueado = <UserM>user;
          this.onUserLogged.emit(this.usuarioLogueado);
        }
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    } else {
      this.onUserLogged.emit(this.usuarioLogueado);
    }
  }

  setUserToStorage() {
    localStorage.setItem('currentUser', JSON.stringify(this.usuarioLogueado));
    this.onUserLogged.emit(this.usuarioLogueado);
  }

  deleteUserFromStorage() {
    localStorage.removeItem('currentUser');
    this.onUserLogout.emit();
  }
}
