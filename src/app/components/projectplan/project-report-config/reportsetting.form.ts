import { FormControl, Validators } from '@angular/forms';

export class ReportSettingForm {
  reportSettingFormBuilder = {
    method: new FormControl(null),
    report: new FormControl(null),
    name: new FormControl(null, [Validators.required]),
    user_id: new FormControl(null)
  };
}
