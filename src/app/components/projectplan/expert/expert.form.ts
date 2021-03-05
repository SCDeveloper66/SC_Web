import { FormControl, Validators } from '@angular/forms';

export class ExpertForm {
  expertFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    name: new FormControl(null, [Validators.required]),
    tel: new FormControl(null, [Validators.maxLength(10)]),
    user_id: new FormControl(null)
  };
}
