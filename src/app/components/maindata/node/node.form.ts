import { FormControl, Validators } from '@angular/forms';

export class NodeForm {
  NodeFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    ip: new FormControl(null),
    name: new FormControl(null, [Validators.required]),
    ref_id: new FormControl(null),
    user_id: new FormControl(null)
  };
}
