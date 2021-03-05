import { FormControl, Validators } from '@angular/forms';

export class ProjectListForm {
  projectListFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    year_from: new FormControl(null),
    year_to: new FormControl(null),
    prj_from: new FormControl(null),
    prj_to: new FormControl(null),
    prj_name: new FormControl(null),
    user_id: new FormControl(null),
    status_id: new FormControl(null) 

  };
}
