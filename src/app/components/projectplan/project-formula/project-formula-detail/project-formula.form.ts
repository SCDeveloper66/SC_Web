import { FormControl, Validators } from '@angular/forms';

export class ProjectFormulaDetailForm {
  projectFormulaDetailFormBuilder = {
    method: new FormControl(null),
    fml_id: new FormControl('0'),
    fml_name: new FormControl(null, [Validators.required]),
    fml_type: new FormControl(null, [Validators.required]),
    fml_input_type: new FormControl(null, [Validators.required]),
    range: new FormControl(null),
    value: new FormControl(null),
    user_id: new FormControl(null)
  };
}
