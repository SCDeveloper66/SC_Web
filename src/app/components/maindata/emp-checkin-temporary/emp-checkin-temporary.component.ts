import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { DatePipe } from '@angular/common';
import { MainDataService } from 'src/app/services/maindata/maindata.service';
import { CheckInTemporaryForm } from './empcheckintemporary.form';
import { Table } from 'primeng/table';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-emp-checkin-temporary',
  templateUrl: './emp-checkin-temporary.component.html',
  styleUrls: ['./emp-checkin-temporary.component.scss']
})
export class EmpCheckinTemporaryComponent implements OnInit {
  token;
  currentUser: any;
  dateFrom: Date;
  dateTo: Date;
  empCodeFrom;
  empCodeTo;
  dep;
  deps: SelectItem[] = [];
  empfname;
  emplname;
  searchDataId;
  temporaryFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  datasource: any[];
  cols: any[];
  public modalAddPerson = false;
  searchFormGroup: FormGroup;
  searchEmpCode;
  searchFullName;
  searchSession;
  searchSessions: SelectItem[] = [];
  searchcols: any[];
  searchDatasource: any[];
  searchSelecteds: string[];
  minDate: Date;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private mainDataService: MainDataService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    public datepipe: DatePipe,
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      const token = JSON.parse(this.localstorageService.getLocalStorage('tokenStandardCan'));
      this.token = token;
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }
    this.localstorageService.removeItem('datasource-local');
  }

  ngOnInit(): void {
    this.spinner.show();
    this.datasource = [];
    this.getMasterDDL();
    this.dateFrom = new Date();
    this.dateTo = new Date();
    this.funcSelectDateFrom(this.dateFrom);
    this.cols = [
      { field: 'start_date', header: 'วันที่เริ่ม', sortable: true },
      { field: 'stop_date', header: 'วันที่สิ้นสุด', sortable: true },
      { field: 'depart', header: 'แผนก', sortable: true },
      { field: 'emp_name', header: 'พนักงาน', sortable: true },
      { field: 'emp_tel', header: 'เบอร์ติดต่อ', sortable: true },
      { field: 'emp_email', header: 'อีเมล', sortable: true },
      { field: 'action', header: 'Action', sortable: true }
    ];
    this.searchcols = [
      { field: 'depart', header: 'แผนก', sortable: true },
      { field: 'emp_name', header: 'ชื่อ-นามสกุล', sortable: true },
      { field: 'emp_tel', header: 'เบอร์ติดต่อ', sortable: true },
      { field: 'emp_email', header: 'อีเมล', sortable: true },
    ];
    const checkInTemporaryForm = new CheckInTemporaryForm();
    this.temporaryFormGroup = this.formBuilder.group(
      checkInTemporaryForm.checkInTemporaryFormBuilder
    );
    this.getCheckinTemporaryList();
  }

  private getMasterDDL() {
    const itemForm = new CheckInTemporaryForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.checkInTemporaryFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.mainDataService.ApiCheckInTemporary(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.deps = [];
          data.department.forEach(m => {
            this.deps.push({ value: m.code, label: m.text });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.alertService.error(err);
        this.spinner.hide();
      });
  }

  searchId(dataKey) {
    this.localstorageService.removeItem('datasource-local');
    const checkInTemporaryForm = new CheckInTemporaryForm();
    this.itemFormGroup = this.formBuilder.group(
      checkInTemporaryForm.checkInTemporaryFormBuilder
    );
    if (dataKey != '') {
      this.itemFormGroup.controls['method'].setValue('search_by_id');
      this.itemFormGroup.controls['emp_code'].setValue(dataKey);
      this.itemFormGroup.controls['user_id'].setValue(this.token);
      this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data) {
            data.forEach(element => {
              this.datasource.push({
                depart: element.depart,
                emp_code: element.emp_code,
                emp_email: element.emp_email,
                emp_name: element.emp_code + ' ' + element.emp_name,
                emp_tel: element.emp_tel,
                id: element.id
              });
            });
          }
          this.spinner.hide();
        }, (err) => {
          this.spinner.hide();
          this.alertService.error(err);
        });
    }
  }

  addPerson() {
    this.getMasterEmpDDl();
    this.localstorageService.removeItem('searchDatasource-local');
    this.searchDatasource = [];
    this.searchEmpCode = '';
    this.searchFullName = '';
    this.searchSession = null;
    this.searchSelecteds = [];
    this.modalAddPerson = true;
  }

  private getMasterEmpDDl() {
    const checkInForm = new CheckInTemporaryForm();
    this.itemFormGroup = this.formBuilder.group(
      checkInForm.checkInTemporaryFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.searchSessions = [];
          data.depart.forEach(m => {
            this.searchSessions.push({ value: m.value, label: m.text });
          });
        }
      }, (err) => {
        this.alertService.error(err);
      });
  }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getCheckinTemporaryList();
  }

  private getCheckinTemporaryList() {
    this.spinner.show();
    const checkInTemporaryForm = new CheckInTemporaryForm();
    this.temporaryFormGroup = this.formBuilder.group(
      checkInTemporaryForm.checkInTemporaryFormBuilder
    );
    this.empCodeFrom = this.empCodeFrom == null ? '' : this.empCodeFrom;
    this.empCodeTo = this.empCodeTo == null ? '' : this.empCodeTo;
    this.empfname = this.empfname == null ? '' : this.empfname;
    this.emplname = this.emplname == null ? '' : this.emplname;
    let dataDateFrom = this.dateFrom == null ? '' : this.datepipe.transform(this.dateFrom, 'dd/MM/yyyy');
    let dataDateTo = this.dateTo == null ? '' : this.datepipe.transform(this.dateTo, 'dd/MM/yyyy');
    this.temporaryFormGroup.controls['method'].setValue('search');
    this.temporaryFormGroup.controls['start_date'].setValue(dataDateFrom);
    this.temporaryFormGroup.controls['stop_date'].setValue(dataDateTo);
    this.temporaryFormGroup.controls['emp_code_from'].setValue(this.empCodeFrom);
    this.temporaryFormGroup.controls['emp_code_to'].setValue(this.empCodeTo);
    this.temporaryFormGroup.controls['depart_from'].setValue(this.dep);
    this.temporaryFormGroup.controls['depart_to'].setValue(this.dep);
    this.temporaryFormGroup.controls['fname'].setValue(this.empfname);
    this.temporaryFormGroup.controls['lname'].setValue(this.emplname);
    this.temporaryFormGroup.controls['user_id'].setValue(this.token);
    this.mainDataService.ApiCheckInTemporary(this.temporaryFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          data.forEach(element => {
            this.datasource.push({
              id: element.id,
              start_date: element.start_date,
              stop_date: element.stop_date,
              emp_tel: element.emp_tel,
              emp_name: element.emp_name,
              emp_email: element.emp_email,
              emp_code: element.emp_code,
              depart: element.depart,
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  saveData() {
    if (this.getFormValidationErrors()) {
      this.spinner.show();
      let valid = 0;
      this.datasource.forEach(element => {
        let startDateValue = '';
        let stopDateValue = '';
        if (element.start_date == null || element.stop_date == null) {
          valid++;
        }
        if ((typeof element.start_date === 'string')
          && (element.start_date.indexOf('/') > -1)) {
          const str = element.start_date.split('/');
          let year = Number(str[2]);
          const month = Number(str[1]) - 1;
          const date = Number(str[0]);
          let newStartDate = new Date(year, month, date);
          startDateValue = this.datepipe.transform(newStartDate, 'dd/MM/yyyy');
          element.start_date = startDateValue;
        } else {
          let newStartDate = new Date(element.start_date);
          let newStopDate = new Date(element.stop_date);
          if (newStopDate < newStartDate) {
            valid++;
          } else {
            startDateValue = this.datepipe.transform(element.start_date, 'dd/MM/yyyy');
            element.start_date = startDateValue;
          }
        }
        if ((typeof element.stop_date === 'string')
          && (element.stop_date.indexOf('/') > -1)) {
          const str = element.stop_date.split('/');
          let year = Number(str[2]);
          const month = Number(str[1]) - 1;
          const date = Number(str[0]);
          let newStartDate = new Date(year, month, date);
          stopDateValue = this.datepipe.transform(newStartDate, 'dd/MM/yyyy');
          element.stop_date = stopDateValue;
        } else {
          let newStartDate = new Date(element.start_date);
          let newStopDate = new Date(element.stop_date);
          if (newStopDate < newStartDate) {
            valid++;
          } else {
            stopDateValue = this.datepipe.transform(element.stop_date, 'dd/MM/yyyy');
            element.stop_date = stopDateValue;
          }
        }
      });
      if (valid > 0) {
        this.spinner.hide();
        this.alertService.warning('รูปแบบวันที่ไม่ถูกต้อง');
        return false;
      }
      this.temporaryFormGroup.controls['method'].setValue('save');
      this.temporaryFormGroup.controls['data'].patchValue(this.datasource);
      this.temporaryFormGroup.controls['user_id'].setValue(this.token);
      this.mainDataService.ApiCheckInTemporary(this.temporaryFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data.status == 'S') {
            this.alertService.success('success');
            this.localstorageService.removeItem('datasource-local');
            this.searchId('');
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
      return false;
    }
  }

  getFormValidationErrors() {
    let valid = true;
    Object.keys(this.temporaryFormGroup.controls).forEach(key => {
      this.temporaryFormGroup.controls[key].markAsDirty();
      this.temporaryFormGroup.controls[key].markAsTouched();
      this.temporaryFormGroup.controls[key].markAsPending();
      const controlErrors: ValidationErrors = this.temporaryFormGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
        valid = false;
      }
    });
    return valid;
  }

  serachDataPerson() {
    this.localstorageService.removeItem('searchDatasource-local');
    this.spinner.show();
    const checkInTemporaryForm = new CheckInTemporaryForm();
    this.searchFormGroup = this.formBuilder.group(
      checkInTemporaryForm.checkInTemporaryFormBuilder
    );
    this.searchFormGroup.controls['method'].setValue('search_by_popup');
    this.searchFormGroup.controls['emp_code'].setValue(this.searchEmpCode);
    this.searchFormGroup.controls['emp_name'].setValue(this.searchFullName);
    this.searchFormGroup.controls['sh_id'].setValue(this.searchSession);
    this.searchFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.searchFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.searchDatasource = [];
          data.forEach(element => {
            this.searchDatasource.push({
              emp_code: element.emp_code,
              depart: element.depart,
              emp_name: element.emp_name,
              emp_tel: element.emp_tel,
              emp_email: element.emp_email,
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.alertService.error(err);
      });
  }

  saveAddPerson() {
    this.modalAddPerson = false;
    this.localstorageService.removeItem('datasource-local');
    this.searchDatasource.forEach(element => {
      if (this.searchSelecteds.some((a) => a == element.emp_code)) {
        this.datasource.push({
          depart: element.depart,
          emp_code: element.emp_code,
          emp_email: element.emp_email,
          emp_name: element.emp_code + ' ' + element.emp_name,
          emp_tel: element.emp_tel,
          id: element.id
        });
      }
    });
  }

  deleteDetailDatasource(empCode) {
    this.localstorageService.removeItem('datasource-local');
    let detailDatasourceNew = [];
    this.datasource.forEach(element => {
      if (empCode != element.emp_code) {
        detailDatasourceNew.push({
          depart: element.depart,
          emp_code: element.emp_code,
          emp_email: element.emp_email,
          emp_name: element.emp_name,
          emp_tel: element.emp_tel,
          id: element.id
        });
      }
    });
    this.datasource = [];
    this.datasource = detailDatasourceNew;
  }

  funcSelectDateFrom(event) {
    let dateFrom = new Date(event);
    let month = dateFrom.getMonth() + 1;
    let year = dateFrom.getFullYear();
    let prevMonth = (month === 0) ? 12 : month - 1;
    let prevYear = (prevMonth === 12) ? year - 1 : year;
    this.minDate = new Date(event);
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(prevYear);
    let dateTo = new Date(this.dateTo);
    if (dateFrom > dateTo) {
      this.dateTo = dateFrom;
    }
  }

}
