import { FormControl, Validators } from '@angular/forms';

export class MachineForm {
  machineFormBuilder = {
    method: new FormControl(null),
    id: new FormControl(null),
    emp_code: new FormControl(null),
    emp_name: new FormControl(null),
    jobStart: new FormControl(null),
    jobStop: new FormControl(null),
    remark: new FormControl(null),
    user_id: new FormControl(null)
  };
}
