import { FormControl, Validators } from '@angular/forms';

export class ProjectDetailForm {
  projectDetailFormBuilder = {
    method: new FormControl(null),
    prj_id: new FormControl('0'),
    prj_name: new FormControl(null, [Validators.required]),
    start_date: new FormControl(null, [Validators.required]),
    stop_date: new FormControl(null, [Validators.required]),
    prj_detail: new FormControl(null),
    prj_status: new FormControl(null, [Validators.required]),
    user_id: new FormControl(null)
  };
}
