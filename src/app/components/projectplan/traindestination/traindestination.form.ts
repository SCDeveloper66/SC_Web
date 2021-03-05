import { FormControl, Validators } from '@angular/forms';

export class TrainDestinationForm {
  trainDestinationFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    name: new FormControl(null, [Validators.required]),
    user_id: new FormControl(null)
  };
}
