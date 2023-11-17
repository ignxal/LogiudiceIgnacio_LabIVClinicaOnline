import {
  Directive,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appCaptcha]',
})
export class CaptchaDirective {
  @Output() captcha = new EventEmitter<String>();
  @Output() captchaResult = new EventEmitter<boolean>();
  @Input() requestCaptcha = false;
  @Input() enteredCaptcha = false;

  theCatpcha: any;

  constructor() {}

  ngOnInit(): void {
    this.createCaptcha();
  }

  createCaptcha() {
    let captcha = [];
    for (let q = 0; q < 6; q++) {
      if (q % 2 == 0) {
        captcha[q] = String.fromCharCode(Math.floor(Math.random() * 26 + 65));
      } else {
        captcha[q] = Math.floor(Math.random() * 10 + 0);
      }
    }
    const theCaptcha = captcha.join('');
    this.theCatpcha = theCaptcha;
    this.captcha.emit(theCaptcha);
  }

  validateCaptcha() {
    this.captchaResult.emit(this.enteredCaptcha === this.theCatpcha);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['requestCaptcha']) {
      this.createCaptcha();
    }

    if (changes['enteredCaptcha']) {
      this.validateCaptcha();
    }
  }
}
