import { FormControl } from '@angular/forms';

export class HolidayForm {
  HolidayFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    year: new FormControl(null),
    user_id: new FormControl(null)
  };
}
