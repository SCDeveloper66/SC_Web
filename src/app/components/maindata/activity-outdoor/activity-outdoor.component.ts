import { DatePipe } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileUpload } from 'primeng/primeng';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { MainDataService } from 'src/app/services/maindata/maindata.service';
import { environment } from 'src/environments/environment';
import { SelectItem } from 'primeng/api';
import { EmployeeBehaviorForm } from '../../employee/employee-detail/employee-behavior.form';
import { EmployeeDetailForm } from '../../employee/employee-detail/employee-detail.form';
import { BookingcarService } from 'src/app/services/bookingcar/bookingcar.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-activity-outdoor',
  templateUrl: './activity-outdoor.component.html',
  styleUrls: ['./activity-outdoor.component.scss']
})
export class ActivityOutdoorComponent implements OnInit {

  token;
  currentUser: any;
  fileId;
  public isEmployee = false;
  public isEmployeeSh = false;
  public isAdmin = false;
  public checkUpload = true;
  // @ViewChild('fileInput', { static: false }) fileInput: FileUpload;
  importDataFormGroup: FormGroup;
  importFiles: any[] = [];
  uplo: File;
  dateUpload: any = { start_time: new Date() };
  createBy;
  createDate;
  activitylist: SelectItem[] = [];
  behavioritemFormGroup: FormGroup;
  public behaviorDetailErrors = false;
  public userIdError = false;
  public dateError = false;
  public scoreError = false;
  itemFormGroup: FormGroup;
  dateFrom: Date;
  isOpenCard: boolean = false;
  readOnlyControl:boolean = false;

  public isInput: boolean = false;

  @ViewChild('emp_code') searchElement: ElementRef;
  @ViewChild('score') scoreElement: ElementRef;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private bookingcarService: BookingcarService,
    private mainDataService: MainDataService,
    private employeeService: EmployeeService,
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      const token = JSON.parse(this.localstorageService.getLocalStorage('tokenStandardCan'));
      this.token = token;
      if (this.currentUser.userGroup == '1') {
        this.isEmployee = true;
      } else if (this.currentUser.userGroup == '2') {
        this.isEmployeeSh = true;
      } else if (this.currentUser.userGroup == '3') {
        this.isAdmin = true;
      }
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }
  }

  public clickBonusChecked(e) {

    this.isOpenCard = e.checked;
    this.readOnlyControl =  this.isOpenCard;
    // alert(bonusChecked);
    // if (this.isOpenCard) {
    //   this.readOnlyControl = true;
    // } else {

    // }

  }

  ngOnInit(): void {

    this.AutoFocus();

    this.dateFrom = new Date();

    const behaviorForm = new EmployeeBehaviorForm();
    this.behavioritemFormGroup = this.formBuilder.group(
      behaviorForm.employeeBehaviorFormBuilder
    );

    this.behavioritemFormGroup.controls['date'].setValue(this.dateFrom);

    this.getMasterDDL();
  }

  AutoFocus() {
    // alert(this.searchElement);
    setTimeout(() => { // this will make the execution after the above boolean has changed
      if (this.isOpenCard) {
        if (this.behavioritemFormGroup.controls['emp_code'].value == null || this.behavioritemFormGroup.controls['emp_code'].value == '') {
          this.searchElement.nativeElement.focus();
        }
      }
      this.AutoFocus();
    }, 2000);
  }

  private getMasterDDL() {
    const itemForm = new EmployeeDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeDetailFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('search');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.itemFormGroup.controls['name'].setValue("");
    this.bookingcarService.ApiMasActivity(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {

        if (data) {
          console.log("load ddl");
          console.log(data);
          this.activitylist = [];
          // this.activitylist.push({ value: '-1', label: 'ทั้งหมด' });
          if (data) {
            data.forEach(m => {
              this.activitylist.push({ value: m.id.toString(), label: m.name });
            });
          }

        }
      }, (err) => {
        this.alertService.error(err);
      });
  }

  get fBehavior() {
    if (this.behavioritemFormGroup.controls['detail_id'].value != null) {
      this.behaviorDetailErrors = false;
    }
    return this.behavioritemFormGroup.controls;
  }

  downloadTemplate() {
    window.open(environment.apiUrl + 'fileTemplate/template_activity_point.xlsx');
  }

  getBehaviorFormValidationErrors() {
    let valid = true;
    this.behaviorDetailErrors = false;
    this.scoreError = false;
    this.dateError = false;
    this.userIdError = false;


    if (this.behavioritemFormGroup.controls['detail_id'].value == null || this.behavioritemFormGroup.controls['detail_id'].value == '') {
      this.behaviorDetailErrors = true;
      valid = false;
    }
    if (this.behavioritemFormGroup.controls['score'].value == null || this.behavioritemFormGroup.controls['score'].value == '') {
      this.scoreError = true;
      valid = false;
    }
    if (this.behavioritemFormGroup.controls['date'].value == null || this.behavioritemFormGroup.controls['date'].value == '') {
      this.dateError = true;
      valid = false;
    }
    if (this.behavioritemFormGroup.controls['emp_code'].value == null || this.behavioritemFormGroup.controls['emp_code'].value == '') {
      this.userIdError = true;
      valid = false;
    }
    return valid;
  }


  onFocusEvent(ev) {
    // alert(ev);
    this.isInput = true;
  }

  onFocusOutEvent(ev) {
    this.isInput = false;
    this.behavioritemFormGroup.controls['emp_code'].setValue("");
    this.searchElement.nativeElement.focus();
  }

  submitData(dataKey) {
    if (this.isOpenCard == false)
      return;

      console.log(this.behavioritemFormGroup.value);

    // if (dataKey == '') {
    //   return;
    // }
    if (this.getBehaviorFormValidationErrors() == false) {
      this.behavioritemFormGroup.controls['emp_code'].setValue("");
      this.searchElement.nativeElement.focus();
      return;
    }


    this.localstorageService.removeItem('datasource-local');

    let behaviorDate = '';
    if ((typeof this.behavioritemFormGroup.controls['date'].value === 'string')
      && (this.behavioritemFormGroup.controls['date'].value.indexOf('/') > -1)) {
      const str = this.behavioritemFormGroup.controls['date'].value.split('/');
      let year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      let newStopDate = new Date(year, month, date);
      behaviorDate = this.datepipe.transform(newStopDate, 'dd/MM/yyyy');
    } else {
      behaviorDate = this.datepipe.transform(this.behavioritemFormGroup.controls['date'].value, 'dd/MM/yyyy');
    }

    this.behavioritemFormGroup.controls['date'].patchValue(behaviorDate);
    this.behavioritemFormGroup.controls['user_id'].setValue(this.token);
    this.behavioritemFormGroup.controls['method'].setValue('update_emp_score');

    // alert(JSON.stringify(this.behavioritemFormGroup.getRawValue()));
    // return;
    this.employeeService.ApiEmployee(this.behavioritemFormGroup.getRawValue()).subscribe(
      (data) => {
        this.spinner.hide();

        if (data) {
          if (data.status == 'S') {
            this.alertService.success(data.message);
            this.behavioritemFormGroup.controls['emp_code'].setValue("");
            this.searchElement.nativeElement.focus();
            // this.getBehaviorTab();
          } else {
            this.behavioritemFormGroup.controls['emp_code'].setValue("");
            this.searchElement.nativeElement.focus();
            this.alertService.error(data.message);
          }
        }

      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
        this.behavioritemFormGroup.controls['emp_code'].setValue("");
        this.searchElement.nativeElement.focus();
      });

  }



}
