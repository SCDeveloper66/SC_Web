import { FormControl, Validators } from '@angular/forms';

export class MachineForm {
  machineFormBuilder = {
    method: new FormControl(null),
    id: new FormControl(null),
    empCode: new FormControl(null),
    empName: new FormControl(null),
    machineCode: new FormControl(null),
    machineName: new FormControl(null),
    jobStart: new FormControl(null),
    jobStop: new FormControl(null),
    remark: new FormControl(null),
    empList: new FormControl(null),
    empOtherList: new FormControl(null),
    user_id: new FormControl(null)
  };
}
