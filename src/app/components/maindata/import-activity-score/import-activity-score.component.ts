import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-import-activity-score',
  templateUrl: './import-activity-score.component.html',
  styleUrls: ['./import-activity-score.component.scss']
})
export class ImportActivityScoreComponent implements OnInit {
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
  itemFormGroup: FormGroup;

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

  ngOnInit(): void {
    const behaviorForm = new EmployeeBehaviorForm();
    this.behavioritemFormGroup = this.formBuilder.group(
      behaviorForm.employeeBehaviorFormBuilder
    );

    this.getMasterDDL();
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
    window.open(environment.apiUrl + 'fileTemplate/template_activity_score.xlsx');
  }

  getBehaviorFormValidationErrors() {
    let valid = true;
    // Object.keys(this.behavioritemFormGroup.controls).forEach(key => {
    //   // alert(key);
    //   this.behavioritemFormGroup.controls[key].markAsDirty();
    //   this.behavioritemFormGroup.controls[key].markAsTouched();
    //   this.behavioritemFormGroup.controls[key].markAsPending();
    //   const controlErrors: ValidationErrors = this.behavioritemFormGroup.get(key).errors;

    //   if (controlErrors != null) {
    //     // alert(JSON.stringify(controlErrors));
    //     Object.keys(controlErrors).forEach(keyError => {
    //       console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
    //     });
    //     valid = false;
    //   }
    // });
    if (this.behavioritemFormGroup.controls['detail_id'].value == null) {
     
      this.behaviorDetailErrors = true;
      valid = false;
    }
    return valid;
  }

  upload(fileItem) {
    if (this.getBehaviorFormValidationErrors() == false) {
      return;
    }
    this.fileId = this.behavioritemFormGroup.controls['detail_id'].value;
    
    this.spinner.show();
    const formData = new FormData();
    for (let file of fileItem.files) {
      formData.append(file.name, file);
    }
    fileItem.clear();
    this.mainDataService
      .UploadFile(formData, '2', this.fileId, this.token)
      .subscribe(
        (next) => {
          debugger;
          if (next.status == 'S') {
            this.alertService.success('success');
          } else {
            this.alertService.error(next.message);
          }
          this.spinner.hide();
          this.importFiles = [];
        },
        (err) => {
          this.spinner.hide();
          this.alertService.error(err);
        });
  }

}
