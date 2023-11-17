import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss'],
})
export class CaptchaComponent implements OnInit {
  @Output() captchaResult = new EventEmitter<boolean>();
  captcha: any = [];
  enteredCaptcha: any;
  generateCaptcha: any;
  captchaForDirective: any;

  constructor() {}

  ngOnInit(): void {}

  onChange(value: any) {
    if (value.length == 6) {
      setTimeout(() => {
        this.captchaForDirective = this.enteredCaptcha;
      }, 200);
    }
  }

  createCaptcha() {
    console.log('createCaptcha');
    this.generateCaptcha = true;
    setTimeout(() => {
      this.generateCaptcha = false;
    }, 200);
  }

  newCaptcha(captcha: any) {
    this.captcha = captcha;
  }

  captchaResultDirective(captchaResult: any) {
    this.captchaResult.emit(captchaResult);
  }
}
