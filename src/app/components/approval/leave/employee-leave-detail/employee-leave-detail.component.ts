import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApprovalService } from 'src/app/services/approval/approval.service';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
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
    this.empLeaveDetailFormGroup.controls['method'].setValue('leave-detail');
    this.empLeaveDetailFormGroup.controls['id'].setValue(
      this.empLeaveId ?? ''
    );
    this.empLeaveDetailFormGroup.controls['user_id'].setValue(this.token);
    this.approvalService
      .ApiApproval(this.empLeaveDetailFormGroup.getRawValue())
      .subscribe(
        (data) => {
          this.items = [];
          if (data) {
            const strStart = data.leave_start.split('/');
            let yearStrat = Number(strStart[2]);
            const monthStrat = Number(strStart[1]) - 1;
            const dateStrat = Number(strStart[0]);
            let newStartDate = new Date(yearStrat, monthStrat, dateStrat);

            const strStop = data.leave_stop.split('/');
            let yearStop = Number(strStop[2]);
            const monthStop = Number(strStop[1]) - 1;
            const dateStop = Number(strStop[0]);
            let newStopDate = new Date(yearStop, monthStop, dateStop);

            this.empLeaveDetailFormGroup.controls['emp_code'].patchValue(
              data.emp_code
            );
            this.empLeaveDetailFormGroup.controls['emp_name'].patchValue(
              data.emp_name
            );
            this.empLeaveDetailFormGroup.controls['typeLeave'].patchValue(
              data.typeLeave
            );
            this.empLeaveDetailFormGroup.controls['leaveStart'].patchValue(
              newStartDate
            );
            this.empLeaveDetailFormGroup.controls['leaveStop'].patchValue(
              newStopDate
            );
            this.empLeaveDetailFormGroup.controls['remark'].patchValue(
              data.remark
            );
            this.items.push({ label: 'Submit' });
            if (data.leave_over == 'N') {
              this.items.push({ label: 'Waiting Approve' });
              this.items.push({ label: 'Approve' });
              if (data.sts_text == 'Submit') {
                this.activeIndex = 1;
                this.btnApprove = true;
              } else if (data.sts_text == 'Approve') {
                this.activeIndex = 2;
              } else {
                this.activeIndex = 0;
              }
            } else {
              this.items.push({ label: 'Waiting Approval1' });
              this.items.push({ label: 'Waiting Approval2' });
              this.items.push({ label: 'Approve' });
              if (data.sts_text == 'Submit') {
                this.activeIndex = 1;
                this.btnApprove = true;
              } else if (data.sts_text == 'Approval1') {
                this.activeIndex = 2;
                this.btnApprove = true;
              } else if (data.sts_text == 'Approval2') {
                this.activeIndex = 3;
              } else {
                this.activeIndex = 0;
              }
            }
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
