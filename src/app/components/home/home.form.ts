import { FormControl, Validators } from '@angular/forms';

export class HomeForm {
  homeFormBuilder = {
    method: new FormControl(null),
    user_id: new FormControl(null),
    select_room_list: new FormControl(null),
    select_car_list: new FormControl(null),
    draft: new FormControl(null),
    pending: new FormControl(null),
    approve: new FormControl(null),
    cancel: new FormControl(null),
    watiDP: new FormControl(null),
    remark: new FormControl(null)
  };
}
