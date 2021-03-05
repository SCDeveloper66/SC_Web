import { FormControl, Validators } from '@angular/forms';

export class ProjectTrainingScheduleListForm {
  projectTrainingScheduleListFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    project_year: new FormControl(null),
    project_name: new FormControl(null),
    training_name: new FormControl(null),
    date_form: new FormControl(null),
    date_to: new FormControl(null),
    user_id: new FormControl(null),
    status_id: new FormControl(null)
  };
}
