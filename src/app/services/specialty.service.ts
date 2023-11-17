import { Injectable } from '@angular/core';
import { Specialty } from '../models/specialty';
import { CollectionsService } from './collections.service';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyService {
  collectionName: string = 'specialties';

  constructor(private colletion: CollectionsService) {}

  getAll() {
    return this.colletion.getAllSnapshot<Specialty>(
      this.collectionName,
      'nombre'
    );
  }

  addOne(name: string) {
    return this.colletion.addOne(this.collectionName, new Specialty('', name));
  }
}
