import { FormControl, Validators } from '@angular/forms';

export class EmployeeDetailForm {
  employeeDetailFormBuilder = {
    method: new FormControl(null),
    emp_code: new FormControl(null),
    start_date: new FormControl(null),
    stop_date: new FormControl(null),
    date: new FormControl(null, [Validators.required]),
    card_no: new FormControl(null, [Validators.required]),
    status: new FormControl(null, [Validators.required]),
    note: new FormControl(null),
    img: new FormControl(null),
    user_id: new FormControl(null),
    name: new FormControl(null)
  };
}
