import { FormControl, Validators } from '@angular/forms';

export class ExpenseForm {
  expenseFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    name: new FormControl(null, [Validators.required]),
    code: new FormControl(null, [Validators.required]),
    user_id: new FormControl(null)
  };
}
