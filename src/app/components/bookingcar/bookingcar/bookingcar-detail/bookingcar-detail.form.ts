import { FormControl, Validators } from '@angular/forms';

export class BookingCarDetailForm {
  bookingCarDetailFormBuilder = {
    method: new FormControl(null),
    emp_code: new FormControl('0'),
    id: new FormControl('0'),
    topic: new FormControl(null),
    start_date: new FormControl(null, [Validators.required]),
    start_time: new FormControl(null, [Validators.required]),
    stop_date: new FormControl(null, [Validators.required]),
    stop_time: new FormControl(null, [Validators.required]),
    person_total: new FormControl(null, [Validators.required]),
    car_type_id: new FormControl(null, [Validators.required]),
    car_id: new FormControl(null, [Validators.required]),
    reason_id: new FormControl(null, [Validators.required]),
    dest_id: new FormControl(null, [Validators.required]),
    remark: new FormControl(null),
    emp_list: new FormControl(null),
    carTypes: new FormControl(null),
    user_id: new FormControl(null),
    bc_request: new FormControl(null),
  };
}
