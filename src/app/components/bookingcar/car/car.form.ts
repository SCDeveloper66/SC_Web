import { FormControl, Validators } from '@angular/forms';

export class CarForm {
  CarFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    car_type_from: new FormControl(null),
    car_type_to: new FormControl(null),
    car_from: new FormControl(null),
    car_to: new FormControl(null),
    car_type_id: new FormControl(null),
    car_type: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    detail: new FormControl(null),
    color: new FormControl(null),
    carTypes: new FormControl(null),
    user_id: new FormControl(null)
  };
}
