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
  empLeaveId = null;
  items: any[];
  items2: any[];
  activeIndex: number = 0;
  empLeaveDetailFormGroup: FormGroup;
  btnApprove: boolean = false;
  btnReject: boolean = false;
  modalConfirm: boolean = false;
  submitStatus;
  submitRemark;
  step1_status = '0';
  step2_status = '0';
  step3_status = '0';
  step4_status = '0';

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
    if (this.empLeaveId == null) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.empLeaveId = id;
      }
    }
    this.empLeaveDetailFormGroup.controls['method'].setValue('detail');
    this.empLeaveDetailFormGroup.controls['leave_id'].setValue(
      this.empLeaveId ?? ''
    );
    this.empLeaveDetailFormGroup.controls['user_id'].setValue(this.token);
    this.approvalService
      .ApiEmployeeLeave(this.empLeaveDetailFormGroup.getRawValue())
      .subscribe(
        (data) => {
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
              if (element.step1_lable != '') {
                this.items.push({ label: element.step1_lable });
              }
              if (element.step2_lable != '') {
                this.items.push({ label: element.step2_lable });
              }
              if (element.step3_lable != '') {
                this.items.push({ label: element.step3_lable });
              }
              if (element.step4_lable != '') {
                this.items.push({ label: element.step4_lable });
              }
              if (element.step1_status == '1') {
                this.activeIndex = 0;
                this.step1_status = '1';
              }
              else if (element.step2_status == '1') {
                this.activeIndex = 1;
                this.step2_status = '1';
              }
              else if (element.step3_status == '1') {
                this.activeIndex = 2;
                this.step3_status = '1';
              }
              else if (element.step4_status == '1') {
                this.activeIndex = 3;
                this.step4_status = '1';
              }

            });
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

  openRemarkEmpLeave(status) {
    this.submitRemark = '';
    this.submitStatus = status;
    this.modalConfirm = true;
  }

  closeRemarkEmpLeave() {
    this.submitStatus = '';
    this.submitRemark = '';
    this.modalConfirm = false;
  }

  saveEmpLeave() {
    if (this.submitRemark != null && this.submitRemark != '') {
      this.spinner.show();
      this.modalConfirm = false;
      const empLeaveDeatilForm = new EmployeeLeaveForm();
      this.empLeaveDetailFormGroup = this.formBuilder.group(
        empLeaveDeatilForm.employeeLeaveFormBuilder
      );
      if (this.submitStatus == 'Approve') {
        this.empLeaveDetailFormGroup.controls['method'].setValue('detail_approve');
      } else if (this.submitStatus == 'Reject') {
        this.empLeaveDetailFormGroup.controls['method'].setValue('detail_reject');
      }
      this.empLeaveDetailFormGroup.controls['leave_id'].setValue(
        this.empLeaveId ?? ''
      );
      this.empLeaveDetailFormGroup.controls['step1_status'].setValue(this.step1_status);
      this.empLeaveDetailFormGroup.controls['step2_status'].setValue(this.step2_status);
      this.empLeaveDetailFormGroup.controls['step3_status'].setValue(this.step3_status);
      this.empLeaveDetailFormGroup.controls['step4_status'].setValue(this.step4_status);
      this.empLeaveDetailFormGroup.controls['submit_remark'].setValue(this.submitRemark);
      this.empLeaveDetailFormGroup.controls['user_id'].setValue(this.token);
      this.approvalService
        .ApiEmployeeLeave(this.empLeaveDetailFormGroup.getRawValue())
        .subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.getDetail();
            } else {
              this.alertService.error(data.message);
            }
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
            this.alertService.error(err);
          }
        );
    } else {
      this.alertService.error('กรุณาระบุเหตุผล');
      return false;
    }
  }
}
