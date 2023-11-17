import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QueryCompositeFilterConstraint,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Collection } from '../models/collection';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  constructor(private _firestore: Firestore) {}

  addOne(collectionName: string, document: Collection) {
    return new Promise<DocumentReference<DocumentData>>((resolve) => {
      let collectionRef = collection(this._firestore, collectionName);
      let docRef: DocumentReference<DocumentData>;

      if (
        document.id == '' ||
        document.id == undefined ||
        document.id == null
      ) {
        docRef = doc(collectionRef);
        document.id = docRef.id;
      } else {
        docRef = doc(collectionRef, document.id);
      }
      setDoc(docRef, { ...document });
      resolve(docRef);
    });
  }

  update(collectionName: string, document: Collection) {
    let collectionRef = collection(this._firestore, collectionName);
    const newDoc = doc(collectionRef, document.id);
    return updateDoc(newDoc, { ...document });
  }

  getOne(collectionName: string, id: string) {
    let collectionRef = collection(this._firestore, collectionName);
    const document = query(collectionRef, where('id', '==', id));

    return getDocs(document);
  }

  async getFirstQuery<T = Collection>(
    collectionName: string,
    querys: QueryCompositeFilterConstraint
  ) {
    let docs = query(collection(this._firestore, collectionName), querys);

    const res = await getDocs(docs);
    return res.docs.map((doc) => doc.data() as T)![0];
  }

  async getAll(collectionName: string) {
    let collectionRef = collection(this._firestore, collectionName);
    const res = await getDocs(collectionRef);
    return res.docs.map((doc) => doc.data() as Collection);
  }

  async getAllWhere(collectionName: string, column: string, value: any) {
    let docs = query(
      collection(this._firestore, collectionName),
      where(column, '==', value)
    );
    const res = await getDocs(docs);
    return res.docs.map((doc) => doc.data() as Collection);
  }

  async exists(collectionName: string, column: string, value: any) {
    let docs = query(
      collection(this._firestore, collectionName),
      where(column, '==', value)
    );

    return !(await getDocs(docs)).empty;
  }

  async existsQuery(
    collectionName: string,
    querys: QueryCompositeFilterConstraint
  ) {
    let docs = query(collection(this._firestore, collectionName), querys);

    return !(await getDocs(docs)).empty;
  }

  getAllSnapshot<T = Collection>(
    collectionName: string,
    order: string
  ): Observable<T[]> {
    let docs = query(
      collection(this._firestore, collectionName),
      orderBy(order)
    );
    return new Observable((subscriber) => {
      const unsubscribe = onSnapshot(docs, (querySnapshot) => {
        const collection: T[] = [];

        querySnapshot.forEach((doc) => {
          const simpleDoc = { ...(doc.data() as T) };
          collection.push(simpleDoc);
        });

        subscriber.next(collection);
      });

      return () => unsubscribe();
    });
  }

  getAllWhereSnapshot<T = Collection>(
    collectionName: string,
    querys: QueryCompositeFilterConstraint,
    order: string
  ): Observable<T[]> {
    let docs = query(
      collection(this._firestore, collectionName),
      querys,
      orderBy(order)
    );
    return new Observable((subscriber) => {
      const unsubscribe = onSnapshot(docs, (querySnapshot) => {
        const collection: T[] = [];

        querySnapshot.forEach((doc) => {
          const simpleDoc = { ...(doc.data() as T) };
          collection.push(simpleDoc);
        });

        subscriber.next(collection);
      });

      return () => unsubscribe();
    });
  }
}
