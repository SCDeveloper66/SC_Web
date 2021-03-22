import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SelectItem, Table } from 'primeng';
import { EmployeeListForm } from 'src/app/components/employee/employee-list/employee-list.form';
import { ApprovalService } from 'src/app/services/approval/approval.service';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { MachineForm } from '../machine.form';

@Component({
  selector: 'app-employee-machine-list',
  templateUrl: './employee-machine-list.component.html',
  styleUrls: ['./employee-machine-list.component.scss'],
})
export class EmployeeMachineListComponent implements OnInit {
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
  machines: SelectItem[] = [];
  machine;

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
  }

  ngOnInit(): void {
    this.spinner.show();
    this.empleaveDateFrom = new Date();
    this.empleaveDateTo = new Date();
    this.funcSelectDateFrom(this.empleaveDateFrom);
    this.datasource = [];
    this.cols = [
      { field: 'no' },
      { field: 'emp_code' },
      { field: 'emp_name' },
      { field: 'job_start' },
      { field: 'job_stop' },
      { field: 'sts_text' },
      { field: 'sts_color' },
      { field: 'remark' },
      { field: 'machineName' },
    ];
    this.getMasterDDL();
    this.getEmpLeaveList();
  }

  search(dt: Table) {
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
      .GetMasterDDL(this.itemFormGroup.getRawValue())
      .subscribe(
        (data) => {
          if (data) {
            this.departments = [];
            this.machines = [];
            this.departments.push({ value: '-1', label: 'ทั้งหมด' });
            if (data.depart) {
              data.depart.forEach((m) => {
                this.departments.push({ value: m.value, label: m.text });
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
    this.spinner.show();
    const empLeaveForm = new MachineForm();
    this.itemFormGroup = this.formBuilder.group(
      empLeaveForm.machineFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('search-machine');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.approvalService
      .ApiApproval(this.itemFormGroup.getRawValue())
      .subscribe(
        (data) => {
          this.datasource = [];
          if (data) {
            data.forEach((element) => {
              this.datasource.push({
                id: element.id,
                no: element.no,
                emp_code: element.emp_code,
                emp_name: element.emp_name,
                job_start: element.job_start,
                job_stop: element.job_stop,
                sts_color: element.sts_color,
                sts_text: element.sts_text,
                remark: element.remark,
                machineName: element.machineName,
              });
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

  empMachine(id) {
    if (id == 'ADD') {
      this.router.navigate(['/approval/employee-machine-detail']);
    } else {
      this.router.navigate(['/approval/employee-machine-detail', id]);
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
}
