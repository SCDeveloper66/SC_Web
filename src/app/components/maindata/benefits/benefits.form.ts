import { FormControl, Validators } from '@angular/forms';

export class BenefitsForm {
  benefitsFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    title: new FormControl(null, [Validators.required]),
    detail: new FormControl(null),
    doc: new FormControl(null),
    url: new FormControl(null),
    user_id: new FormControl(null)
  };
}
