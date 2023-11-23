import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  and,
  QueryFieldFilterConstraint,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserM } from '../models/user';
import { CollectionsService } from './collections.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  collection: string = 'users';
  userCollection!: CollectionReference<DocumentData>;
  userList!: Observable<UserM[]>;
  db!: Firestore;

  constructor(
    private _firestore: Firestore,
    private collections: CollectionsService
  ) {
    this.userCollection = collection(this._firestore, 'users');
    this.userList = collectionData(this.userCollection) as Observable<UserM[]>;
  }

  save(usuario: UserM) {
    const documentoNuevo = doc(this.userCollection);
    usuario.id_user = documentoNuevo.id;

    setDoc(documentoNuevo, { ...usuario });
  }

  async exists(user: UserM): Promise<boolean> {
    let users = query(
      collection(this._firestore, this.collection),
      where('documento', '==', user.documento),
      where('role', '==', user.role)
    );
    return !(await getDocs(users)).empty;
  }

  async existsEmail(email: string): Promise<boolean> {
    let users = query(
      collection(this._firestore, this.collection),
      where('email', '==', email)
    );
    return (await getDocs(users)).empty;
  }

  getAll(): Observable<UserM[]> {
    return this.userList;
  }

  async addOne(user: UserM): Promise<boolean> {
    const docRef: DocumentReference<DocumentData> = doc(this.userCollection);
    user.id_user = docRef.id;
    setDoc(docRef, { ...user });

    return true;
  }

  update(item: UserM) {
    const usuario = doc(this.userCollection, item.id_user);
    return updateDoc(usuario, { ...item });
  }

  async getOne(id: string): Promise<UserM> {
    let user!: UserM;
    let users = query(
      collection(this._firestore, this.collection),
      where('uid', '==', id)
    );
    user = await getDocs(users).then((res) => res.docs[0].data() as UserM);
    return user;
  }

  getAllUsers(): Observable<UserM[]> {
    return this.collections.getAllSnapshot(this.collection, 'registerDate');
  }

  getAllSpecialists() {
    const querys = [where('role', '==', 'Specialist')];

    return this.collections.getAllWhereSnapshot(
      this.collection,
      and(...querys),
      'nombre'
    );
  }
}
