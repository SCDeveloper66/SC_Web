import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { EmployeeListForm } from './employee-list.form';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  token;
  currentUser: any;
  employeeCodeFrom;
  employeeCodeTo;
  departmentFrom;
  departmentTo;
  sessionFrom;
  sessionTo;
  statusFrom;
  statusTo;
  departmentFroms: SelectItem[] = [];
  departmentTos: SelectItem[] = [];
  sessionFroms: SelectItem[] = [];
  sessionTos: SelectItem[] = [];
  statusFroms: SelectItem[] = [];
  statusTos: SelectItem[] = [];
  fName;
  surNameEmp;
  nameHead;
  surNameHead;
  cols: any[];
  datasource: any[];
  employeeListFormGroup: FormGroup;
  itemFormGroup: FormGroup;

  isMobile: boolean = false;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      const token = JSON.parse(this.localstorageService.getLocalStorage('tokenStandardCan'));
      this.token = token;
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }

    let platform = this.localstorageService.getLocalStorage('sc_platform');
    if (platform != null && platform == "mobile") {
      this.isMobile = true;
    }
    this.localstorageService.removeItem('datasource-local');
  }

  ngOnInit(): void {
    this.datasource = [];
    const employeeListForm = new EmployeeListForm();
    this.employeeListFormGroup = this.formBuilder.group(
      employeeListForm.employeeListFormBuilder
    );
    this.getMasterDDL();
    this.cols = [
      { field: 'number', header: '#', sortable: true, width: '50px' },
      { field: 'employeeCode', header: 'รหัสพนักงาน', sortable: true, width: '120px' },
      { field: 'employeeTitle', header: 'คำนำหน้า', sortable: true, width: '100px' },
      { field: 'employeeFName', header: 'ชื่อ', sortable: true, width: '150px' },
      { field: 'employeeLName', header: 'นามสกุล', sortable: true, width: '150px' },
      { field: 'employeeDep', header: 'ฝ่าย', sortable: true, width: '100px' },
      { field: 'employeeSes', header: 'แผนก', sortable: true, width: '100px' },
      { field: 'employeeLevel', header: 'ระดับพนักงาน', sortable: true, width: '120px' },
      { field: 'action', header: 'Action', sortable: true, width: '100px' }
    ];
    this.getEmployeeList();
  }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getEmployeeList();
  }

  private getMasterDDL() {
    const itemForm = new EmployeeListForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeListFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.GetMasterDDL(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.departmentFroms = [];
          this.departmentFroms.push({ value: '-1', label: 'ทั้งหมด' });
          this.departmentTos = [];
          this.departmentTos.push({ value: '-1', label: 'ทั้งหมด' });
          this.sessionFroms = [];
          this.sessionFroms.push({ value: '-1', label: 'ทั้งหมด' });
          this.sessionTos = [];
          this.sessionTos.push({ value: '-1', label: 'ทั้งหมด' });
          this.statusFroms = [];
          this.statusFroms.push({ value: '-1', label: 'ทั้งหมด' });
          this.statusTos = [];
          this.statusTos.push({ value: '-1', label: 'ทั้งหมด' });
          if (data.depart) {
            data.depart.forEach(m => {
              this.departmentFroms.push({ value: m.value, label: m.text });
              this.departmentTos.push({ value: m.value, label: m.text });
            });
          }
          if (data.sh) {
            data.sh.forEach(m => {
              this.sessionFroms.push({ value: m.value, label: m.text });
              this.sessionTos.push({ value: m.value, label: m.text });
            });
          }
          if (data.emp_status) {
            data.emp_status.forEach(m => {
              this.statusFroms.push({ value: m.value, label: m.text });
              this.statusTos.push({ value: m.value, label: m.text });
            });
          }
        }
      }, (err) => {
        this.alertService.error(err);
      });
  }

  private getEmployeeList() {
    this.spinner.show();
    this.localstorageService.removeItem('datasource-local');
    this.employeeCodeFrom = this.employeeCodeFrom == null ? '' : this.employeeCodeFrom;
    this.employeeCodeTo = this.employeeCodeTo == null ? '' : this.employeeCodeTo;
    this.departmentFrom = this.departmentFrom == null ? '' : this.departmentFrom;
    this.departmentTo = this.departmentTo == null ? '' : this.departmentTo;
    this.sessionFrom = this.sessionFrom == null ? '' : this.sessionFrom;
    this.sessionTo = this.sessionTo == null ? '' : this.sessionTo;
    this.statusFrom = this.statusFrom == null ? '' : this.statusFrom;
    this.statusTo = this.statusTo == null ? '' : this.statusTo;
    this.fName = this.fName == null ? '' : this.fName;
    this.surNameEmp = this.surNameEmp == null ? '' : this.surNameEmp;
    this.nameHead = this.nameHead == null ? '' : this.nameHead;
    this.surNameHead = this.surNameHead == null ? '' : this.surNameHead;

    this.employeeListFormGroup.controls['method'].setValue('search');
    this.employeeListFormGroup.controls['emp_code_start'].setValue(this.employeeCodeFrom);
    this.employeeListFormGroup.controls['emp_code_stop'].setValue(this.employeeCodeTo);
    this.employeeListFormGroup.controls['sh_start'].setValue(this.sessionFrom);
    this.employeeListFormGroup.controls['sh_stop'].setValue(this.sessionTo);
    this.employeeListFormGroup.controls['depart_start'].setValue(this.departmentFrom);
    this.employeeListFormGroup.controls['depart_stop'].setValue(this.departmentTo);
    this.employeeListFormGroup.controls['emp_status_start'].setValue(this.statusFrom);
    this.employeeListFormGroup.controls['emp_status_stop'].setValue(this.statusTo);
    this.employeeListFormGroup.controls['emp_fname'].setValue(this.fName);
    this.employeeListFormGroup.controls['emp_lname'].setValue(this.surNameEmp);
    this.employeeListFormGroup.controls['head_fname'].setValue(this.nameHead);
    this.employeeListFormGroup.controls['head_lname'].setValue(this.surNameHead);
    this.employeeListFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.employeeListFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          let i = 0;
          data.forEach(element => {
            i++;
            this.datasource.push({
              number: i,
              id: element.emp_code,
              employeeCode: element.emp_code,
              employeeTitle: element.emp_title,
              employeeFName: element.emp_fname,
              employeeLName: element.emp_lname,
              employeeDep: element.ds_name,
              employeeSes: element.md_name,
              employeeLevel: element.emp_level
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  empDetail(empId) {
    this.router.navigate(['/employee/employee-detail', empId]);
  }

}
