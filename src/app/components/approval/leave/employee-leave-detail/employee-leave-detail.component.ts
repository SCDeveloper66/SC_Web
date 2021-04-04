import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApprovalService } from 'src/app/services/approval/approval.service';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { EmployeeLeaveForm } from '../employee-leave.form';

@Component({
  selector: 'app-employee-leave-detail',
  templateUrl: './employee-leave-detail.component.html',
  styleUrls: ['./employee-leave-detail.component.scss'],
})
export class EmployeeLeaveDetailComponent implements OnInit {
  token;
  currentUser: any;
  empLeaveId;
  items: any[];
  items2: any[];
  activeIndex: number = 0;
  empLeaveDetailFormGroup: FormGroup;
  btnApprove: boolean = false;
  btnReject: boolean = false;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private approvalService: ApprovalService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private employeeService: EmployeeService,
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
    const empLeaveDeatilForm = new EmployeeLeaveForm();
    this.empLeaveDetailFormGroup = this.formBuilder.group(
      empLeaveDeatilForm.employeeLeaveFormBuilder
    );
    this.getDetail();
  }

  private getDetail() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.empLeaveId = id;
    }
    this.empLeaveDetailFormGroup.controls['method'].setValue('detail');
    this.empLeaveDetailFormGroup.controls['leave_id'].setValue(
      this.empLeaveId ?? ''
    );
    this.empLeaveDetailFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService
      .ApiJsoft(this.empLeaveDetailFormGroup.getRawValue())
      .subscribe(
        (data) => {
          debugger;
          this.items = [];
          if (data) {
            data.forEach(element => {
              this.empLeaveDetailFormGroup.controls['emp_code'].patchValue(
                element.emp_code
              );
              let fullname = element.emp_fname + ' ' + element.emp_lname;
              this.empLeaveDetailFormGroup.controls['emp_name'].patchValue(
                fullname
              );
              this.empLeaveDetailFormGroup.controls['depart_name'].patchValue(
                element.depart_name
              );
              this.empLeaveDetailFormGroup.controls['leave_type'].patchValue(
                element.leave_type
              );
              this.empLeaveDetailFormGroup.controls['date_from'].patchValue(
                element.date_start
              );
              this.empLeaveDetailFormGroup.controls['date_to'].patchValue(
                element.date_stop
              );
              this.empLeaveDetailFormGroup.controls['remark'].patchValue(
                element.remark
              );
              this.btnApprove = element.btn_appr == '1' ? true : false;
              this.btnReject = element.btn_reject == '1' ? true : false;
            });

            // this.items.push({ label: 'Submit' });
            // if (data.leave_over == 'N') {
            //   this.items.push({ label: 'Waiting Approve' });
            //   this.items.push({ label: 'Approve' });
            //   if (data.sts_text == 'Submit') {
            //     this.activeIndex = 1;
            //   } else if (data.sts_text == 'Approve') {
            //     this.activeIndex = 2;
            //   } else {
            //     this.activeIndex = 0;
            //   }
            // } else {
            //   this.items.push({ label: 'Waiting Approval1' });
            //   this.items.push({ label: 'Waiting Approval2' });
            //   this.items.push({ label: 'Approve' });
            //   if (data.sts_text == 'Submit') {
            //     this.activeIndex = 1;
            //     this.btnApprove = true;
            //   } else if (data.sts_text == 'Approval1') {
            //     this.activeIndex = 2;
            //     this.btnApprove = true;
            //   } else if (data.sts_text == 'Approval2') {
            //     this.activeIndex = 3;
            //   } else {
            //     this.activeIndex = 0;
            //   }
            // }
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
