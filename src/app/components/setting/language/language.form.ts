import { FormControl, Validators } from '@angular/forms';

export class LanguageForm {
  LanguageFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    param: new FormControl(null),
    en: new FormControl(null),
    th: new FormControl(null),
    my: new FormControl(null),
    langCountry: new FormControl(null),
    user_id: new FormControl(null)
  };
}
