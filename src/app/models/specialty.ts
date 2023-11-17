import { Collection } from './collection';

export class Specialty implements Collection {
  constructor(public id: string, public nombre: string) {}
}
