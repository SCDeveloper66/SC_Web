import { FormControl } from '@angular/forms';

export class TimeAttRealtimeForm {
  timeAttRealtimeFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    start_date: new FormControl(null),
    stop_date: new FormControl(null),
    emp_code_from: new FormControl(null),
    emp_code_to: new FormControl(null),
    depart_from: new FormControl(null),
    depart_to: new FormControl(null),
    fname: new FormControl(null),
    lname: new FormControl(null),
    node_from: new FormControl(null),
    node_to: new FormControl(null),
    fileName: new FormControl(null),
    user_id: new FormControl(null)
  };
}
