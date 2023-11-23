import { Roles } from './roles';
import { Timestamp } from '@angular/fire/firestore';

export interface UserM {
  uid: string;
  id_user: string;
  email: string;
  nombre: string;
  apellido: string;
  documento: string;
  edad: number;
  photoURL: string;
  imageUrl: string[];
  role: Roles;
  obraSocial: string;
  especialidad: string;
  emailVerified?: boolean;
  approved?: boolean;
  registerDate: Timestamp;
  confirmationDate: Timestamp | null;
}
