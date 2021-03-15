import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { MeetingroomService } from 'src/app/services/meetingroom/meetingroom.service';
import { EmployeeLeaveDetailForm } from './employee-leave-detail.form';

@Component({
  selector: 'app-employee-leave-detail',
  templateUrl: './employee-leave-detail.component.html',
  styleUrls: ['./employee-leave-detail.component.scss'],
})
export class EmployeeLeaveDetailComponent implements OnInit {
  token;
  currentUser: any;
  empLeaveRoomId;
  items: any[];
  activeIndex: number = 0;
  empLeaveDetailFormGroup: FormGroup;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      const token = JSON.parse(
        this.localstorageService.getLocalStorage('tokenStandardCan')
      );
      this.token = token;
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    const empLeaveDeatilForm = new EmployeeLeaveDetailForm();
    this.empLeaveDetailFormGroup = this.formBuilder.group(
      empLeaveDeatilForm.employeeLeaveDetailFormBuilder
    );
    this.items = [
      {
        label: 'Draft',
      },
      {
        label: 'Waiting Approve',
      },
      {
        label: 'Approved',
      },
    ];
    this.getDetail();
  }

  private getDetail() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.empLeaveRoomId = id;
    }
    this.empLeaveDetailFormGroup.controls['method'].setValue('leave-detail');
    this.empLeaveDetailFormGroup.controls['id'].setValue(
      this.empLeaveRoomId ?? ''
    );
    this.empLeaveDetailFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService
      .ApiEmployee(this.empLeaveDetailFormGroup.getRawValue())
      .subscribe(
        (data) => {
          if (data) {
            this.empLeaveDetailFormGroup.controls['emp_code'].patchValue(data.emp_code);
            this.empLeaveDetailFormGroup.controls['emp_name'].patchValue(data.emp_name);
            this.empLeaveDetailFormGroup.controls['typeLeave'].patchValue(data.typeLeave);
            this.empLeaveDetailFormGroup.controls['leave_start'].patchValue(data.leave_start);
            this.empLeaveDetailFormGroup.controls['leave_stop'].patchValue(data.leave_stop);
            this.empLeaveDetailFormGroup.controls['remark'].patchValue(data.remark);
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          this.alertService.error(err);
        }
      );
  }
  get f() {
    return this.empLeaveDetailFormGroup.controls;
  }
}
