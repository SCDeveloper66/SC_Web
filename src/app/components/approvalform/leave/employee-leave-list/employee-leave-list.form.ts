import { FormControl, Validators } from '@angular/forms';

export class EmployeeLeaveListForm {
  employeeLeaveListFormBuilder = {
    method: new FormControl(null),
    user_id: new FormControl(null)
  };
}
