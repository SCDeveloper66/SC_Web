import { FormControl, Validators } from '@angular/forms';

export class ProjectFormulaListForm {
  projectFormulaListFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    fml_type: new FormControl(null),
    fml_name: new FormControl(null),
    user_id: new FormControl(null)
  };
}
