import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng';
import { SelectItem } from 'primeng/api/selectitem';
import { EmployeeListForm } from 'src/app/components/employee/employee-list/employee-list.form';
import { ApprovalService } from 'src/app/services/approval/approval.service';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { EmployeeLeaveForm } from '../employee-leave.form';

@Component({
  selector: 'app-employee-leave-list',
  templateUrl: './employee-leave-list.component.html',
  styleUrls: ['./employee-leave-list.component.scss'],
})
export class EmployeeLeaveListComponent implements OnInit {

  token;
  currentUser: any;
  datasource: any[];
  cols: any[];
  itemFormGroup: FormGroup;
  empleaveDateFrom: Date;
  empleaveDateTo: Date;
  minDate: Date;
  empCode;
  empfName;
  emplName;
  departments: SelectItem[] = [];
  department;
  leaves: SelectItem[] = [];
  leave;
  selectLeaveList: any[];
  leaveData: any[];
  modalConfirm: boolean = false;
  submitStatus;
  submitRemark;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private employeeService: EmployeeService,
    private approvalService: ApprovalService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    public datepipe: DatePipe,
    private router: Router
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
    this.localstorageService.removeItem('datasource-local');
  }

  ngOnInit(): void {
    this.localstorageService.removeItem('datasource-local');
    this.spinner.show();
    this.empleaveDateFrom = new Date();
    this.empleaveDateTo = new Date();
    this.funcSelectDateFrom(this.empleaveDateFrom);
    this.datasource = [];
    this.selectLeaveList = [];
    this.cols = [
      { field: 'no' },
      { field: 'emp_code' },
      { field: 'emp_name' },
      { field: 'depart_name' },
      { field: 'leave_id' },
      { field: 'leave_type' },
      { field: 'leave_date' },
      { field: 'status_id' },
      { field: 'status_color' },
      { field: 'status_name' },
      { field: 'remark' },
      { field: 'value1' },
      { field: 'value2' },
    ];
    this.getMasterDDL();
    this.getEmpLeaveList();
  }

  search(dt: Table) {
    this.selectLeaveList = [];
    this.localstorageService.removeItem('datasource-local');
    this.getEmpLeaveList();
  }

  private getMasterDDL() {
    const itemForm = new EmployeeListForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeListFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService
      .ApiJsoft(this.itemFormGroup.getRawValue())
      .subscribe(
        (data) => {
          if (data) {
            this.departments = [];
            // this.departments.push({ value: '-1', label: 'ทั้งหมด' });
            if (data.depart) {
              data.depart.forEach((m) => {
                this.departments.push({ value: m.id, label: m.name });
              });
            }
            this.leaves = [];
            // this.leave.push({ value: '-1', label: 'ทั้งหมด' });
            if (data.type) {
              data.type.forEach((m) => {
                this.leaves.push({ value: m.id, label: m.name });
              });
            }
          }
        },
        (err) => {
          this.alertService.error(err);
        }
      );
  }

  private getEmpLeaveList() {
    this.selectLeaveList = [];
    this.localstorageService.removeItem('datasource-local');
    this.spinner.show();
    const empLeaveForm = new EmployeeLeaveForm();
    this.itemFormGroup = this.formBuilder.group(
      empLeaveForm.employeeLeaveFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('search');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.itemFormGroup.controls['leave_id'].setValue(this.leave);
    this.itemFormGroup.controls['depart_id'].setValue(this.department);
    let startDate = this.datepipe.transform(this.empleaveDateFrom, 'dd/MM/yyyy');
    this.itemFormGroup.controls['date_from'].setValue(startDate);
    let endDate = this.datepipe.transform(this.empleaveDateTo, 'dd/MM/yyyy');
    this.itemFormGroup.controls['date_to'].setValue(endDate);
    this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.itemFormGroup.controls['emp_fname'].setValue(this.empfName);
    this.itemFormGroup.controls['emp_lname'].setValue(this.emplName);
    this.employeeService
      .ApiJsoft(this.itemFormGroup.getRawValue())
      .subscribe(
        (data) => {
          this.datasource = [];
          if (data) {
            let no = 1;
            data.forEach((element) => {
              this.datasource.push({
                no: no,
                leave_id: element.leave_id,
                leave_type: element.leave_type,
                depart_name: element.depart_name,
                emp_code: element.emp_code,
                emp_name: (element.emp_fname ?? '') + ' ' + (element.emp_lname ?? ''),
                leave_date: element.date_start + ' - ' + element.date_stop,
                remark: element.remark,
                sts_id: element.status_id,
                sts_color: element.sts_color,
                sts_text: element.sts_text,
                value1: element.value1,
                value2: element.value2
              });
              no++;
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

  empLeave(leave_id) {
    if (leave_id == 'ADD') {
      this.router.navigate(['/approval/employee-leave-detail']);
    } else {
      this.router.navigate(['/approval/employee-leave-detail', leave_id]);
    }
  }

  funcSelectDateFrom(event) {
    let dateFrom = new Date(event);
    let month = dateFrom.getMonth() + 1;
    let year = dateFrom.getFullYear();
    let prevMonth = month === 0 ? 12 : month - 1;
    let prevYear = prevMonth === 12 ? year - 1 : year;
    this.minDate = new Date(event);
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(prevYear);
    let dateTo = new Date(this.empleaveDateTo);
    if (dateFrom > dateTo) {
      this.empleaveDateTo = dateFrom;
    }
  }

  saveCheckAll() {
    if (this.submitRemark != null && this.submitRemark != '') {
      if (this.selectLeaveList.length != 0) {
        this.submitStatus = '';
        this.submitRemark = '';
        this.modalConfirm = false;
        this.spinner.show();
        const empLeaveForm = new EmployeeLeaveForm();
        this.itemFormGroup = this.formBuilder.group(
          empLeaveForm.employeeLeaveFormBuilder
        );
        if (this.submitStatus == 'Approve') {
          this.itemFormGroup.controls['submit_type'].setValue('1');
        } else if (this.submitStatus == 'Reject') {
          this.itemFormGroup.controls['submit_type'].setValue('0');
        }
        this.leaveData = [];
        this.selectLeaveList.forEach((element) => {
          this.leaveData.push({
            id: element.leave_id
          });
        });
        this.itemFormGroup.controls['method'].setValue('submit_all');
        this.itemFormGroup.controls['user_id'].setValue(this.token);
        this.itemFormGroup.controls['leave'].setValue(this.leaveData);
        this.itemFormGroup.controls['submit_remark'].setValue(this.submitRemark);
        this.employeeService
          .ApiJsoft(this.itemFormGroup.getRawValue())
          .subscribe(
            (data) => {
              if (data.status == 'S') {
                this.alertService.success('success');
                this.getEmpLeaveList();
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
        this.alertService.error('กรุณาเลือกรายการ');
        return false;
      }
    } else {
      this.alertService.error('กรุณาระบุเหตุผล');
      return false;
    }
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

}
