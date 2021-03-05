import { FormControl, Validators } from '@angular/forms';

export class EmployeeGradeForm {
  employeeGradeFormBuilder = {
    method: new FormControl(null),
    emp_code: new FormControl(null),
    id: new FormControl('0'),
    no: new FormControl(null, [Validators.required]),
    date: new FormControl(null, [Validators.required]),
    grade: new FormControl(null, [Validators.required]),
    user_id: new FormControl(null)
  };
}
