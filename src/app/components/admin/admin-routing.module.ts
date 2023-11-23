import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbmAdminComponent } from './abm/abm-admin.component';
import { RegisterAdminComponent } from './register/register-admin.component';
import { UserlistAdminComponent } from './userlist/userlist-admin.component';

const routes: Routes = [
  { path: '', component: AbmAdminComponent },
  { path: 'register', component: RegisterAdminComponent },
  { path: 'userlist', component: UserlistAdminComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
