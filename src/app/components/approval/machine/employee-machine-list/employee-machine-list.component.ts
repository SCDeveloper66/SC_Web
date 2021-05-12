import { element } from 'protractor';
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
  jobName;
  empCode;
  empfName;
  emplName;
  departments: SelectItem[] = [];
  department;
  jobshifts: SelectItem[] = [];
  jobshift;
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
      { field: 'id' },
      { field: 'job_name' },
      { field: 'job_desc' },
      { field: 'machine_name' },
      { field: 'shift_name' },
      { field: 'job_start' },
      { field: 'job_stop' },
      { field: 'job_time' },
      { field: 'status_id' },
      { field: 'status_color' },
      { field: 'status_name' },
      { field: 'request_by' },
      { field: 'value1' },
      { field: 'value2' },
      { field: 'job_from_date' },
      { field: 'job_from_time' },
    ];
    this.getMasterDDL();
    this.getMachineList();
  }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getMachineList();
  }

  private getMasterDDL() {
    const itemForm = new EmployeeListForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeListFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.approvalService
      .ApiMachineApproval(this.itemFormGroup.getRawValue())
      .subscribe(
        (data) => {
          if (data) {
            this.departments = [];
            this.machines = [];
            this.jobshifts = [];
            if (data.depart) {
              data.depart.forEach((m) => {
                this.departments.push({ value: m.code, label: m.text });
              });
            }
            if (data.machine) {
              data.machine.forEach((m) => {
                this.machines.push({ value: m.code, label: m.text });
              });
            }
            if (data.shift) {
              data.shift.forEach((m) => {
                this.jobshifts.push({ value: m.code, label: m.text });
              });
            }
          }
        },
        (err) => {
          this.alertService.error(err);
        }
      );
  }

  private getMachineList() {
    this.spinner.show();
    const empLeaveForm = new MachineForm();
    this.itemFormGroup = this.formBuilder.group(
      empLeaveForm.machineFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('search');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.itemFormGroup.controls['job_name'].setValue(this.jobName);
    this.itemFormGroup.controls['dept_id'].setValue(this.department);
    let startDate = this.datepipe.transform(this.empleaveDateFrom, 'dd/MM/yyyy');
    this.itemFormGroup.controls['from_date'].setValue(startDate);
    let endDate = this.datepipe.transform(this.empleaveDateTo, 'dd/MM/yyyy');
    this.itemFormGroup.controls['to_date'].setValue(endDate);
    this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.itemFormGroup.controls['emp_fname'].setValue(this.empfName);
    this.itemFormGroup.controls['emp_lname'].setValue(this.emplName);
    this.itemFormGroup.controls['machine_id'].setValue(this.machine);
    this.itemFormGroup.controls['shift_id'].setValue(this.jobshift);
    this.approvalService
      .ApiMachineApproval(this.itemFormGroup.getRawValue())
      .subscribe(
        (data) => {
          this.datasource = [];
          if (data) {
            let i = 1;
            data.forEach((element) => {
              this.datasource.push({
                no: i,
                id: element.job_id,
                job_name: element.job_name,
                job_desc: element.job_desc,
                machine_name: element.machine_name,
                shift_name: element.shift_name,
                job_start: element.date_start,
                job_stop: element.date_stop,
                job_time: element.date_start + ' - ' + element.date_stop,
                status_id: element.status_id,
                status_color: element.status_color,
                status_name: element.status_name,
                request_by: element.request_by,
                value1: element.value1,
                value2: element.value2,
                job_from_date: element.job_from_date,
                job_from_time: element.job_from_time
              });
              i++;
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
