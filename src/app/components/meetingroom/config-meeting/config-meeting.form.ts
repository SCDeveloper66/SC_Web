import { FormControl, Validators } from '@angular/forms';

export class ConfigMeetingForm {
  configMeetingFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    timelimit: new FormControl(null, [Validators.required]),
    desc: new FormControl(null, [Validators.required]),
    score: new FormControl(null, [Validators.required]),
    user_id: new FormControl(null)
  };
}
