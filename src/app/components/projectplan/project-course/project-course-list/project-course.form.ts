import { FormControl, Validators } from '@angular/forms';

export class ProjectCourseListForm {
  projectCourseListFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    year_from: new FormControl(null),
    year_to: new FormControl(null),
    project_from: new FormControl(null),
    project_to: new FormControl(null),
    course_name: new FormControl(null),
    user_id: new FormControl(null),
    status_id: new FormControl(null)
  };
}
