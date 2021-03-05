import { FormControl, Validators } from '@angular/forms';

export class BookingCarSearchForm {
  bookingCarSearchFormBuilder = {
    method: new FormControl(null),
    emp_code: new FormControl(null),
    emp_name: new FormControl(null),
    sh_id: new FormControl(null),
    user_id: new FormControl(null)
  };
}
