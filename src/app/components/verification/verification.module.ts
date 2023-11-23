import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificationRoutingModule } from './verification-routing.module';
import { VerificationComponent } from './verification.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [VerificationComponent],
  imports: [CommonModule, FormsModule, VerificationRoutingModule, RouterModule],
})
export class VerificationModule {}
