import { FormControl, Validators } from '@angular/forms';

export class RoomForm {
  roomFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    name: new FormControl(null, [Validators.required]),
    code: new FormControl(null, [Validators.required]),
    color: new FormControl(null),
    user_id: new FormControl(null)
  };
}
