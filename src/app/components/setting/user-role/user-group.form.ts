import { FormControl } from '@angular/forms';

export class UserGroupForm {
  UserGroupFormBuilder = {
    method: new FormControl(null),
    id: new FormControl(null),
    name: new FormControl(null),
    detail: new FormControl(null),
    user_id: new FormControl(null)
  };
}
