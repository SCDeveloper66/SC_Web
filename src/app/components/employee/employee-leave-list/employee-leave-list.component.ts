import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { EmployeeListForm } from '../employee-list/employee-list.form';

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

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private employeeService: EmployeeService,
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
    this.datasource = [];
    this.cols = [
      { field: 'no' },
      { field: 'emp_code' },
      { field: 'emp_name' },
      { field: 'leave_start' },
      { field: 'leave_stop' },
      { field: 'sts_text' },
      { field: 'sts_color' },
      { field: 'remark' },
    ];
    this.getEmpLeaveList();
  }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getEmpLeaveList();
  }

  private getEmpLeaveList() {
    this.spinner.show();
    const empLeaveForm = new EmployeeListForm();
    this.itemFormGroup = this.formBuilder.group(
      empLeaveForm.employeeListFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('search-leve');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          data.forEach(element => {
            this.datasource.push({
              id: element.id,
              no: element.no,
              emp_code: element.emp_code,
              emp_name: element.emp_name,
              leave_start: element.leave_start,
              leave_stop: element.leave_stop,
              sts_color: element.sts_color,
              sts_text: element.sts_text,
              remark: element.remark
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  empLeave(id) {
    if (id == 'ADD') {
      this.router.navigate(['/employee/employee-leave-detail']);
    } else {
      this.router.navigate(['/employee/employee-leave-detail', id]);
    }
  }

}
