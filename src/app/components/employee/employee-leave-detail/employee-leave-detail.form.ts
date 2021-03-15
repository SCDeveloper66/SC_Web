import { FormControl, Validators } from '@angular/forms';

export class EmployeeLeaveDetailForm {
  employeeLeaveDetailFormBuilder = {
    method: new FormControl(null),
    id: new FormControl(null),
    emp_code: new FormControl(null),
    emp_name: new FormControl(null),
    typeLeave: new FormControl(null),
    leaveStart: new FormControl(null),
    leaveStop: new FormControl(null),
    remark: new FormControl(null),
    user_id: new FormControl(null)
  };
}
