import { FormControl, Validators } from '@angular/forms';

export class EmployeeListForm {
  employeeListFormBuilder = {
    method: new FormControl(null),
    emp_code_start: new FormControl(null),
    emp_code_stop: new FormControl(null),
    sh_start: new FormControl(null),
    sh_stop: new FormControl(null),
    depart_start: new FormControl(null),
    depart_stop: new FormControl(null),
    emp_status_start: new FormControl(null),
    emp_status_stop: new FormControl(null),
    emp_fname: new FormControl(null),
    emp_lname: new FormControl(null),
    head_fname: new FormControl(null),
    head_lname: new FormControl(null),
    user_id: new FormControl(null)
  };
}
