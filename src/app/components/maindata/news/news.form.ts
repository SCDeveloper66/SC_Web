import { FormControl, Validators } from '@angular/forms';

export class NewsForm {
  newsFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    topic: new FormControl(null, [Validators.required]),
    newsTypeId: new FormControl(null),
    newsTypeName: new FormControl(null),
    detail: new FormControl(null),
    img: new FormControl(null),
    url: new FormControl(null),
    urlVdo: new FormControl(null),
    user_id: new FormControl(null)
  };
}

