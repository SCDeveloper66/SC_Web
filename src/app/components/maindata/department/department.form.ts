import { FormControl, Validators } from '@angular/forms';

export class DepartmentForm {
  DepartmentFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    name: new FormControl(null),
    tel: new FormControl(null),
    dis_status: new FormControl(false),
    dis_status_dis: new FormControl(null),
    user_id: new FormControl(null)
  };
}
