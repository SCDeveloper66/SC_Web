import { FormControl, Validators } from '@angular/forms';

export class EmployeeCardForm {
  employeeCardFormBuilder = {
    method: new FormControl(null),
    emp_code: new FormControl(null),
    id: new FormControl('0'),
    date: new FormControl(null, [Validators.required]),
    card_no: new FormControl(null, [Validators.required]),
    status: new FormControl(null, [Validators.required]),
    user_id: new FormControl(null)
  };
}
