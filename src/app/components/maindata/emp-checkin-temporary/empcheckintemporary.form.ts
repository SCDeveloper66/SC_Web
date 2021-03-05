import { FormControl, Validators } from '@angular/forms';

export class CheckInTemporaryForm {
  checkInTemporaryFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    emp_code: new FormControl(null),
    emp_name: new FormControl(null),
    sh_id: new FormControl(null),
    data: new FormControl(null),
    start_date: new FormControl(null),
    stop_date: new FormControl(null),
    emp_code_from: new FormControl(null),
    emp_code_to: new FormControl(null),
    depart_from: new FormControl(null),
    depart_to: new FormControl(null),
    fname: new FormControl(null),
    lname: new FormControl(null),
    user_id: new FormControl(null)
  };
}
