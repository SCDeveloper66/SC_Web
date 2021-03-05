import { FormControl, Validators } from '@angular/forms';

export class CarReasonForm {
  CarReasonFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    name: new FormControl(null, [Validators.required]),
    desc: new FormControl(null),
    user_id: new FormControl(null)
  };
}
