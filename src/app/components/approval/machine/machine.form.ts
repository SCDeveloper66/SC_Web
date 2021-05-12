import { FormControl, Validators } from '@angular/forms';

export class MachineForm {
  machineFormBuilder = {
    method: new FormControl(null),
    job_name: new FormControl(null),
    dept_id: new FormControl(null),
    from_date: new FormControl(null),
    to_date: new FormControl(null),
    emp_code: new FormControl(null),
    emp_fname: new FormControl(null),
    emp_lname: new FormControl(null),
    machine_id: new FormControl(null),
    shift_id: new FormControl(null),
    job_id: new FormControl(null),
    jobshift: new FormControl(null),
    job_desc: new FormControl(null),
    empList: new FormControl(null),
    empOtherList: new FormControl(null),
    submit_type: new FormControl(null),
    date_start: new FormControl(null),
    date_stop: new FormControl(null),
    submit_remark: new FormControl(null),
    detail_emp_1: new FormControl(null),
    detail_emp_2: new FormControl(null),
    user_id: new FormControl(null)
  };
}
