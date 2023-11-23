import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abm-admin',
  templateUrl: './abm-admin.component.html',
  styleUrls: ['./abm-admin.component.scss'],
})
export class AbmAdminComponent implements OnInit {
  usersData: any[] = [];

  constructor(
    private userService: UserService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.getUsersData();
  }

  getUsersData() {
    this.loaderService.show();
    this.userService.getAllSpecialists().subscribe({
      next: (users) => {
        console.log(users);
        this.usersData = users;
        this.loaderService.hide();
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hide();
      },
    });
  }

  disableUser(uid: any) {
    this._updateUser(uid, false);
  }

  enableUser(uid: any) {
    this._updateUser(uid, true);
  }

  private _updateUser(uid: any, state: boolean) {
    this.loaderService.show();
    this.userService
      .getOne(uid)
      .then((user) => {
        user.approved = state;
        this.userService
          .update(user)
          .then(() => {
            this.getUsersData();
            this.loaderService.hide();
            Swal.fire({
              icon: 'success',
              title: 'Operación exitosa!',
              text: 'Se actualizo el estado correctamente',
            });
          })
          .catch((err) => {
            console.error(err);
            this.loaderService.hide();
          });
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Se produjo un error al intentar actualizar el estado',
        });
        console.error(err);
        this.loaderService.hide();
      });
  }
}
