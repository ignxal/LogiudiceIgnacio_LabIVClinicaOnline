import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterHomeComponent } from './register-home/register-home.component';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { RegisterSpecialistComponent } from './register-specialist/register-specialist.component';

const routes: Routes = [
  { path: '', component: RegisterHomeComponent },
  { path: 'patient', component: RegisterPatientComponent },
  { path: 'specialist', component: RegisterSpecialistComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRoutingModule {}
