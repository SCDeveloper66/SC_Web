import { FormControl, Validators } from '@angular/forms';

export class EmployeeLeaveForm {
  employeeLeaveFormBuilder = {
    method: new FormControl(null),
    id: new FormControl(null),
    emp_code: new FormControl(null),
    emp_fname: new FormControl(null),
    emp_lname: new FormControl(null),
    emp_name: new FormControl(null),
    leave_id: new FormControl(null),
    leave_type: new FormControl(null),
    depart_id: new FormControl(null),
    depart_name: new FormControl(null),
    date_from: new FormControl(null),
    date_to: new FormControl(null),
    remark: new FormControl(null),
    step1_status: new FormControl(null),
    step2_status: new FormControl(null),
    step3_status: new FormControl(null),
    step4_status: new FormControl(null),
    submit_remark: new FormControl(null),
    submit_type: new FormControl(null),
    leave: new FormControl(null),
    user_id: new FormControl(null)
  };
}


