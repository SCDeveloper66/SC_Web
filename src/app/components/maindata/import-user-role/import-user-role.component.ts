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

@Component({
  selector: 'app-import-user-role',
  templateUrl: './import-user-role.component.html',
  styleUrls: ['./import-user-role.component.scss']
})
export class ImportUserRoleComponent implements OnInit {

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
  }

  upload(fileItem) {
    this.spinner.show();
    const formData = new FormData();
    for (let file of fileItem.files) {
      formData.append(file.name, file);
    }
    fileItem.clear();
    this.mainDataService
      .UploadFile(formData, "4", this.fileId, this.token)
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

