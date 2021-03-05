import { Validators, FormControl } from '@angular/forms';

export class LoginForm {
  loginFormBuilder = {
    userName: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  };
}
