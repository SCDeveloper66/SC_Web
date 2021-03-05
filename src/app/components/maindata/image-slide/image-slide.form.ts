import { FormControl, Validators } from '@angular/forms';

export class ImageSlideForm {
  ImageSlideFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    img: new FormControl(null),
    url: new FormControl(null),
    order: new FormControl(null),
    user_id: new FormControl(null)
  };
}
