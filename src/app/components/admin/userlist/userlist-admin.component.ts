import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { LoaderService } from 'src/app/services/loader.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userlist-admin',
  templateUrl: './userlist-admin.component.html',
  styleUrls: ['./userlist-admin.component.scss'],
})
export class UserlistAdminComponent implements OnInit {
  usersData: any[] = [];
  patientMedicalHistory: any;
  userData: any;
  patientAppointments: any;
  appointmentsBySpecialist: any;
  patientsBySpecialist: any = [];
  patients: any;

  constructor(
    private userService: UserService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.getUsersData();
  }

  getUsersData() {
    this.loaderService.show();

    this.userService.getAllUsers().subscribe({
      next: (users: any) => {
        this.usersData = users;
        this.loaderService.hide();
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Se produjo un error al intentar obtener la lista de usuarios',
        });
        this.loaderService.hide();
      },
    });
  }

  downloadData() {
    var table_elt = document.getElementById('users-table');
    var workbook = XLSX.utils.table_to_book(table_elt);
    var ws = workbook.Sheets['Sheet1'];
    XLSX.utils.sheet_add_aoa(ws, [['Created ' + new Date().toISOString()]], {
      origin: -1,
    });
    XLSX.writeFile(workbook, 'lista-usuarios.xlsx');
  }
}
