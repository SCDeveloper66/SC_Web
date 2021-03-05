import { FormControl, Validators } from '@angular/forms';

export class UserRoleForm {
  UserRoleFormBuilder = {
    method: new FormControl(null),
    usergroup_id: new FormControl('0'),
    usergroup_Desc: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
    program_list: new FormControl(null),
    active: new FormControl(true),
    user_id: new FormControl(null)
  };
}
