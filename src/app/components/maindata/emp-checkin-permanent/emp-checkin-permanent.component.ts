import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { MainDataService } from 'src/app/services/maindata/maindata.service';
import { CheckInPermanentForm } from './empcheckinpermanent.form';
import { SelectItem } from 'primeng/api';


@Component({
  selector: 'app-emp-checkin-permanent',
  templateUrl: './emp-checkin-permanent.component.html',
  styleUrls: ['./emp-checkin-permanent.component.scss']
})
export class EmpCheckinPermanentComponent implements OnInit {
  token;
  currentUser: any;
  searchDataId;
  detailcols: any[];
  detailDatasource: any[];
  checkInFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  public modalAddPerson = false;
  searchEmpCode;
  searchFullName;
  searchSession;
  searchSessions: SelectItem[] = [];
  searchcols: any[];
  searchDatasource: any[];
  searchSelecteds: string[];

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private mainDataService: MainDataService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      const token = JSON.parse(this.localstorageService.getLocalStorage('tokenStandardCan'));
      this.token = token;
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }
    this.localstorageService.removeItem('detailDatasource-local');
    this.localstorageService.removeItem('searchDatasource-local');
  }

  ngOnInit(): void {
    this.spinner.show();
    const checkInForm = new CheckInPermanentForm();
    this.checkInFormGroup = this.formBuilder.group(
      checkInForm.checkInPermanentFormBuilder
    );
    const itemForm = new CheckInPermanentForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.checkInPermanentFormBuilder
    );
    this.getMasterDDl();
    this.detailcols = [
      { field: 'depart', header: 'แผนก', sortable: true },
      { field: 'emp_name', header: 'พนักงาน', sortable: true },
      { field: 'emp_tel', header: 'เบอร์ติดต่อ', sortable: true },
      { field: 'emp_email', header: 'อีเมล', sortable: true },
      { field: 'action', header: 'Action', sortable: true },
    ];
    this.searchcols = [
      { field: 'depart', header: 'แผนก', sortable: true },
      { field: 'emp_name', header: 'ชื่อ-นามสกุล', sortable: true },
      { field: 'emp_tel', header: 'เบอร์ติดต่อ', sortable: true },
      { field: 'emp_email', header: 'อีเมล', sortable: true },
    ];
    this.getDetail();
  }

  private getMasterDDl() {
    const checkInForm = new CheckInPermanentForm();
    this.itemFormGroup = this.formBuilder.group(
      checkInForm.checkInPermanentFormBuilder
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

  private getDetail() {
    this.detailDatasource = [];
    this.localstorageService.removeItem('detailDatasource-local');
    const checkInForm = new CheckInPermanentForm();
    this.itemFormGroup = this.formBuilder.group(
      checkInForm.checkInPermanentFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('search');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.mainDataService.ApiCheckInPermanent(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          data.forEach(element => {
            this.detailDatasource.push({
              depart: element.depart,
              emp_code: element.emp_code,
              emp_email: element.emp_email,
              emp_name: element.emp_name,
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

  searchId(dataKey) {
    this.localstorageService.removeItem('detailDatasource-local');
    const checkInForm = new CheckInPermanentForm();
    this.itemFormGroup = this.formBuilder.group(
      checkInForm.checkInPermanentFormBuilder
    );
    if (dataKey != '') {
      this.itemFormGroup.controls['method'].setValue('search_by_id');
      this.itemFormGroup.controls['emp_code'].setValue(dataKey);
      this.itemFormGroup.controls['user_id'].setValue(this.token);
      this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data) {
            data.forEach(element => {
              this.detailDatasource.push({
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
    this.getMasterDDl();
    this.localstorageService.removeItem('searchDatasource-local');
    this.searchDatasource = [];
    this.searchEmpCode = '';
    this.searchFullName = '';
    this.searchSession = null;
    this.searchSelecteds = [];
    this.modalAddPerson = true;
  }

  serachDataPerson() {
    this.localstorageService.removeItem('searchDatasource-local');
    this.spinner.show();
    const checkInSearchForm = new CheckInPermanentForm();
    this.searchFormGroup = this.formBuilder.group(
      checkInSearchForm.checkInPermanentFormBuilder
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
    this.localstorageService.removeItem('detailDatasource-local');
    this.searchDatasource.forEach(element => {
      if (this.searchSelecteds.some((a) => a == element.emp_code)) {
        this.detailDatasource.push({
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
    this.localstorageService.removeItem('detailDatasource-local');
    let detailDatasourceNew = [];
    this.detailDatasource.forEach(element => {
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
    this.detailDatasource = [];
    this.detailDatasource = detailDatasourceNew;
  }

  saveData() {
    if (this.getFormValidationErrors()) {
      this.spinner.show();
      this.checkInFormGroup.controls['method'].setValue('save');
      this.checkInFormGroup.controls['data'].patchValue(this.detailDatasource);
      this.checkInFormGroup.controls['user_id'].setValue(this.token);
      this.mainDataService.ApiCheckInPermanent(this.checkInFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data.status == 'S') {
            this.alertService.success('success');
            this.localstorageService.removeItem('detailDatasource-local');
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
    Object.keys(this.checkInFormGroup.controls).forEach(key => {
      this.checkInFormGroup.controls[key].markAsDirty();
      this.checkInFormGroup.controls[key].markAsTouched();
      this.checkInFormGroup.controls[key].markAsPending();
      const controlErrors: ValidationErrors = this.checkInFormGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
        valid = false;
      }
    });
    return valid;
  }

}
