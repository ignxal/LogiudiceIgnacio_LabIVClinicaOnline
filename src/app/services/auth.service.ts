import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afauth: AngularFireAuth, private afs: AngularFirestore) {}

  async register(userObj: any) {
    const { email, password } = userObj;

    try {
      const credential = await this.afauth.createUserWithEmailAndPassword(
        email,
        password
      );

      await this.updateUserData(credential.user, userObj);

      return credential;
    } catch (error) {
      throw error;
    }
  }

  private async updateUserData(user: firebase.User | null, userObj: any) {
    if (user) {
      const userRef = this.afs.collection('users').doc(user.uid);

      return userRef.set({
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        age: userObj.age,
        dni: userObj.dni,
        userType: userObj.userType,
        specialty: userObj.specialty,
        healthInsurance: userObj.healthInsurance,
      });
    }
  }

  async login(email: string, password: string) {
    return await this.afauth.signInWithEmailAndPassword(email, password);
  }

  getUserLogged() {
    return this.afauth.authState;
  }

  logout() {
    this.afauth.signOut();
  }
}
