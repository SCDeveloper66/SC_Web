import { FormControl, Validators } from '@angular/forms';

export class EmployeeLeaveForm {
  employeeLeaveFormBuilder = {
    method: new FormControl(null),
    id: new FormControl(null),
    emp_code: new FormControl(null),
    emp_fname: new FormControl(null),
    emp_lname: new FormControl(null),
    leave_id: new FormControl(null),
    depart_id: new FormControl(null),
    date_from: new FormControl(null),
    date_to: new FormControl(null),
    user_id: new FormControl(null)
  };
}
