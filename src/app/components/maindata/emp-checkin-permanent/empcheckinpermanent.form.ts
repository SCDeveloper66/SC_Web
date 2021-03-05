import { FormControl, Validators } from '@angular/forms';

export class CheckInPermanentForm {
  checkInPermanentFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    emp_code: new FormControl(null),
    emp_name: new FormControl(null),
    sh_id: new FormControl(null),
    data: new FormControl(null),
    user_id: new FormControl(null)
  };
}
