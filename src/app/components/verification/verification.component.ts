import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getParams();
  }

  getParams() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      const mode = params['mode'];

      if (mode != 'verifyEmail') return;

      const oobCode = params['oobCode'];

      this.handleVerifyEmail(oobCode);
    });
  }

  handleVerifyEmail(oobCode: string) {
    this.auth
      .activateAccount(oobCode)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Verificación exitosa!',
          text: 'Redirigiendo al inicio de sesion',
          timer: 1500,
        }).then((r) => {
          this.router.navigate(['/login']);
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Verificación fallida!',
          text: 'Volve a intentarlo',
          timer: 1500,
        }).then((r) => {
          this.router.navigate(['/login']);
        });
      });
  }
}
