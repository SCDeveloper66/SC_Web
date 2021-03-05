import { FormControl, Validators } from '@angular/forms';

export class EmployeeBehaviorForm {
  employeeBehaviorFormBuilder = {
    method: new FormControl(null),
    emp_code: new FormControl(null),
    id: new FormControl('0'),
    // year: new FormControl(null, [Validators.required]),
    date: new FormControl(null, [Validators.required]),
    detail: new FormControl(null, [Validators.required]),
    score: new FormControl(null, [Validators.required]),
    user_id: new FormControl(null),
    detail_id: new FormControl(null, [Validators.required]),
  };
}
