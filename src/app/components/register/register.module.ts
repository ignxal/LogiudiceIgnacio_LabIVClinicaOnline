import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { RegisterHomeComponent } from './register-home/register-home.component';
import { RegisterSpecialistComponent } from './register-specialist/register-specialist.component';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    RegisterComponent,
    RegisterHomeComponent,
    RegisterSpecialistComponent,
    RegisterPatientComponent,
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    SharedModule,
    MatIconModule,
  ],
})
export class RegisterModule {}
