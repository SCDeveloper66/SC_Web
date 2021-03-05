import { FormControl, Validators } from '@angular/forms';

export class ProjectCourseDetailForm {
  projectCourseDetailFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    project_id: new FormControl(null, [Validators.required]),
    course_name: new FormControl(null, [Validators.required]),
    course_id: new FormControl(null, [Validators.required]),
    formula_id: new FormControl(null, [Validators.required]),
    location_id: new FormControl(null, [Validators.required]),
    expert_id: new FormControl(null, [Validators.required]),
    status_id: new FormControl(null, [Validators.required]),
    file_name: new FormControl(null),
    file_url: new FormControl(null),
    file_base64: new FormControl(null),
    remark: new FormControl(null),
    score1: new FormControl(null),
    score2: new FormControl(null),
    score3: new FormControl(null),
    score4: new FormControl(null),
    score5: new FormControl(null),
    user_id: new FormControl(null)
  };
}
