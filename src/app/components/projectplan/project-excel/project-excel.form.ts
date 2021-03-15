import { FormControl, Validators } from '@angular/forms';
export class ProjectExcelForm {
    benefitsFormBuilder = {
        method: new FormControl(null),
        id: new FormControl('0'),
        title: new FormControl(null, [Validators.required]),
        detail: new FormControl(null),
        doc: new FormControl(null),
        url: new FormControl(null),
        user_id: new FormControl(null)
      };

      projectexcelFormBuilder = {
        method: new FormControl(null),
        job_id: new FormControl('0'),
        course_id: new FormControl(null, [Validators.required]),
        fomular_id : new FormControl(null, [Validators.required]),
        room_id : new FormControl(null, [Validators.required]),
        prj_date: new FormControl(null, [Validators.required]),
        prj_start_time: new FormControl(null, [Validators.required]),
        prj_stop_time: new FormControl(null, [Validators.required]),
        user_id: new FormControl(null)
      };

}
