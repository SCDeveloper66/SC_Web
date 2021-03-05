import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { ProjectplanService } from 'src/app/services/projectplan/projectplan.service';
import { ReportSettingForm } from './reportsetting.form';

@Component({
  selector: 'app-project-report-config',
  templateUrl: './project-report-config.component.html',
  styleUrls: ['./project-report-config.component.scss']
})
export class ProjectReportConfigComponent implements OnInit {
  token;
  currentUser: any;
  reportSettingFormGroup: FormGroup;
  itemFormGroup: FormGroup;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private projectplanService: ProjectplanService,
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
  }

  ngOnInit(): void {
    const reportSettingForm = new ReportSettingForm();
    this.reportSettingFormGroup = this.formBuilder.group(
      reportSettingForm.reportSettingFormBuilder
    );
    const itemForm = new ReportSettingForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.reportSettingFormBuilder
    );
    this.getReportSettingList();
  }

  get f() { return this.reportSettingFormGroup.controls; }

  private getReportSettingList() {
    this.spinner.show();
    this.itemFormGroup.controls['method'].setValue('search');
    this.itemFormGroup.controls['report'].setValue('project');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.projectplanService.ApiReportSetting(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        data.forEach(element => {
          this.reportSettingFormGroup.controls['name'].patchValue(element.name);
        });
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  saveItem() {
    if (this.getFormValidationErrors()) {
      this.spinner.show();
      this.reportSettingFormGroup.controls['method'].setValue('update');
      this.reportSettingFormGroup.controls['report'].setValue('project');
      this.reportSettingFormGroup.controls['user_id'].setValue(this.token);
      this.projectplanService.ApiReportSetting(this.reportSettingFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data.status == 'S') {
            this.alertService.success('success');
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
    Object.keys(this.reportSettingFormGroup.controls).forEach(key => {
      this.reportSettingFormGroup.controls[key].markAsDirty();
      this.reportSettingFormGroup.controls[key].markAsTouched();
      this.reportSettingFormGroup.controls[key].markAsPending();
      const controlErrors: ValidationErrors = this.reportSettingFormGroup.get(key).errors;
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
