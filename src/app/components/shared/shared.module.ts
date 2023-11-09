import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderComponent } from './loader/loader.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [LoaderComponent, NavbarComponent],
  imports: [CommonModule, RouterModule, MatProgressBarModule],
  exports: [NavbarComponent],
})
export class SharedModule {}
