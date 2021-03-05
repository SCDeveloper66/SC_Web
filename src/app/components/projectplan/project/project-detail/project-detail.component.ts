import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { ProjectplanService } from 'src/app/services/projectplan/projectplan.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { DatePipe } from '@angular/common';
import { ProjectDetailForm } from './project-detail.form';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  token;
  currentUser: any;
  projectDetailId;
  status: SelectItem[] = [];
  projectDetailFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  detailData: any;
  minDate: Date;
  public prjStatusErrors = false;

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router,
    public globalVariableService: GlobalVariableService,
    private projectplanService: ProjectplanService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    public datepipe: DatePipe,
    private route: ActivatedRoute,
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      const token = JSON.parse(this.localstorageService.getLocalStorage('tokenStandardCan'));
      this.token = token;
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    const projectDetailForm = new ProjectDetailForm();
    this.projectDetailFormGroup = this.formBuilder.group(
      projectDetailForm.projectDetailFormBuilder
    );
    let dateToday = new Date();
    this.projectDetailFormGroup.controls['start_date'].setValue(dateToday);
    this.projectDetailFormGroup.controls['stop_date'].setValue(dateToday);
    this.funcSelectDateFrom(dateToday);
    this.status = [
      { label: 'ใช้งาน', value: '1' },
      { label: 'ไม่ใช้งาน', value: '0' }
    ];
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectDetailId = id;
      this.getDetail();
    }
    else {
      this.spinner.hide();
    }
  }

  get f() {
    if (this.projectDetailFormGroup.controls['prj_status'].value != null) {
      this.prjStatusErrors = false;
    }
    return this.projectDetailFormGroup.controls;
  }


  private getDetail() {
    this.detailData = null;
    this.status = [];
    this.status = [
      { label: 'ใช้งาน', value: '1' },
      { label: 'ไม่ใช้งาน', value: '0' }
    ];
    const projectDetailForm = new ProjectDetailForm();
    this.projectDetailFormGroup = this.formBuilder.group(
      projectDetailForm.projectDetailFormBuilder
    );
    this.projectDetailFormGroup.controls['method'].setValue('detail');
    this.projectDetailFormGroup.controls['prj_id'].setValue(this.projectDetailId ?? '');
    this.projectDetailFormGroup.controls['user_id'].setValue(this.token);
    this.projectplanService.ApiProject(this.projectDetailFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.detailData = data;
          if (this.projectDetailId) {
            data.forEach(element => {
              this.projectDetailFormGroup.controls['prj_id'].patchValue(element.prj_id);
              this.projectDetailFormGroup.controls['prj_name'].patchValue(element.prj_name);
              this.projectDetailFormGroup.controls['prj_detail'].patchValue(element.prj_detail);
              this.projectDetailFormGroup.controls['prj_status'].patchValue(element.prj_status);
              this.projectDetailFormGroup.controls['start_date'].patchValue(element.star_tdate);
              this.projectDetailFormGroup.controls['stop_date'].patchValue(element.stop_date);
            });
          }
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
      let projectStartDate = '';
      let projectStopDate = '';
      if ((typeof this.projectDetailFormGroup.controls['start_date'].value === 'string')
        && (this.projectDetailFormGroup.controls['start_date'].value.indexOf('/') > -1)) {
        const str = this.projectDetailFormGroup.controls['start_date'].value.split('/');
        let year = Number(str[2]);
        const month = Number(str[1]) - 1;
        const date = Number(str[0]);
        let newStartDate = new Date(year, month, date);
        projectStartDate = this.datepipe.transform(newStartDate, 'dd/MM/yyyy');
      } else {
        projectStartDate = this.datepipe.transform(this.projectDetailFormGroup.controls['start_date'].value, 'dd/MM/yyyy');
      }
      this.projectDetailFormGroup.controls['start_date'].patchValue(projectStartDate);

      if ((typeof this.projectDetailFormGroup.controls['stop_date'].value === 'string')
        && (this.projectDetailFormGroup.controls['stop_date'].value.indexOf('/') > -1)) {
        const str = this.projectDetailFormGroup.controls['stop_date'].value.split('/');
        let year = Number(str[2]);
        const month = Number(str[1]) - 1;
        const date = Number(str[0]);
        let newStopDate = new Date(year, month, date);
        projectStopDate = this.datepipe.transform(newStopDate, 'dd/MM/yyyy');
      } else {
        projectStopDate = this.datepipe.transform(this.projectDetailFormGroup.controls['stop_date'].value, 'dd/MM/yyyy');
      }
      this.projectDetailFormGroup.controls['stop_date'].patchValue(projectStopDate);

      if (this.projectDetailFormGroup.controls['prj_id'].value == '0' || this.projectDetailFormGroup.controls['prj_id'].value == '') {
        this.projectDetailFormGroup.controls['prj_id'].setValue('');
        this.projectDetailFormGroup.controls['method'].setValue('insert');
        this.projectDetailFormGroup.controls['user_id'].setValue(this.token);
        this.projectplanService.ApiProject(this.projectDetailFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.projectDetailId = data.value;
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
        this.projectDetailFormGroup.controls['method'].setValue('update');
        this.projectDetailFormGroup.controls['prj_id'].setValue(this.projectDetailId ?? '');
        this.projectDetailFormGroup.controls['user_id'].setValue(this.token);
        this.projectplanService.ApiProject(this.projectDetailFormGroup.getRawValue()).subscribe(
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
      }
    } else {
      return false;
    }
  }

  getFormValidationErrors() {
    let valid = true;
    Object.keys(this.projectDetailFormGroup.controls).forEach(key => {
      this.projectDetailFormGroup.controls[key].markAsDirty();
      this.projectDetailFormGroup.controls[key].markAsTouched();
      this.projectDetailFormGroup.controls[key].markAsPending();
      const controlErrors: ValidationErrors = this.projectDetailFormGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
        valid = false;
      }
    });
    if (this.projectDetailFormGroup.controls['prj_status'].value == null) {
      this.prjStatusErrors = true;
    }
    return valid;
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
    let stopDate = this.projectDetailFormGroup.controls['stop_date'].value;
    let dateTo = new Date(stopDate);
    if (dateFrom > dateTo) {
      this.projectDetailFormGroup.controls['stop_date'].setValue(dateFrom);
    }
  }

}
