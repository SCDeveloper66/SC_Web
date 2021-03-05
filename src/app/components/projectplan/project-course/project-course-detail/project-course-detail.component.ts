import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { ProjectplanService } from 'src/app/services/projectplan/projectplan.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { DatePipe } from '@angular/common';
import { ProjectCourseDetailForm } from './project-course.foem';

@Component({
  selector: 'app-project-course-detail',
  templateUrl: './project-course-detail.component.html',
  styleUrls: ['./project-course-detail.component.scss']
})
export class ProjectCourseDetailComponent implements OnInit {
  token;
  currentUser: any;
  projectDetailId;
  formulas: SelectItem[] = [];
  formulaTypes: SelectItem[] = [];
  projects: SelectItem[] = [];
  experts: SelectItem[] = [];
  locations: SelectItem[] = [];
  status: SelectItem[] = [];
  projectDetailFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  detailData: any;
  psdFile;
  fileBase64;
  public displayUrl = false;
  dataUrl;
  fileName;
  public projectIdErrors = false;
  public courseIdErrors = false;
  public formulaIdErrors = false;
  public locationIdErrors = false;
  public expertIdErrors = false;
  public statusError = false;

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
    const projectDetailForm = new ProjectCourseDetailForm();
    this.projectDetailFormGroup = this.formBuilder.group(
      projectDetailForm.projectCourseDetailFormBuilder
    );
    this.formulas = [
      { label: 'อิงเกณฑ์', value: '1' },
      { label: 'อิงกลุ่ม', value: '2' }
    ];
    this.formulaTypes = [
      { label: 'O means internal training', value: 'O' },
      { label: 'X means external training', value: 'X' }
    ];
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
      this.getDetail();
      this.spinner.hide();
    }
  }

  get f() {
    if (this.projectDetailFormGroup.controls['project_id'].value != null) {
      this.projectIdErrors = false;
    }
    if (this.projectDetailFormGroup.controls['course_id'].value != null) {
      this.courseIdErrors = false;
    }
    if (this.projectDetailFormGroup.controls['formula_id'].value != null) {
      this.formulaIdErrors = false;
    }
    if (this.projectDetailFormGroup.controls['location_id'].value != null) {
      this.locationIdErrors = false;
    }
    if (this.projectDetailFormGroup.controls['expert_id'].value != null) {
      this.expertIdErrors = false;
    }
    if (this.projectDetailFormGroup.controls['status_id'].value != null) {
      this.statusError = false;
    }
    return this.projectDetailFormGroup.controls;
  }


  private getDetail() {
    this.detailData = null;
    this.psdFile = '';
    this.formulaTypes = [];
    this.formulaTypes = [
      { label: 'O means internal training', value: 'O' },
      { label: 'X means external training', value: 'X' }
    ];
    this.projects = [];
    this.experts = [];
    this.locations = [];
    this.formulas = [];
    const projectDetailForm = new ProjectCourseDetailForm();
    this.projectDetailFormGroup = this.formBuilder.group(
      projectDetailForm.projectCourseDetailFormBuilder
    );
    this.projectDetailFormGroup.controls['method'].setValue('detail');
    this.projectDetailFormGroup.controls['id'].setValue(this.projectDetailId ?? '');
    this.projectDetailFormGroup.controls['user_id'].setValue(this.token);
    this.projectplanService.ApiProjectCourse(this.projectDetailFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {

          console.log(data);
          
          this.detailData = data;
          data.project.forEach(m => {
            this.projects.push({ value: m.code, label: m.text });
          });
          data.expert.forEach(m => {
            this.experts.push({ value: m.code, label: m.text });
          });
          data.location.forEach(m => {
            this.locations.push({ value: m.code, label: m.text });
          });
          data.formula.forEach(m => {
            this.formulas.push({ value: m.code, label: m.text });
          });
          if (this.projectDetailId) {
            data.data.forEach(element => {
              this.projectDetailFormGroup.controls['course_id'].patchValue(element.course_id);
              this.projectDetailFormGroup.controls['course_name'].patchValue(element.course_name);
              this.projectDetailFormGroup.controls['expert_id'].patchValue(element.expert_id);
              this.projectDetailFormGroup.controls['file_name'].patchValue(element.file_name);
              this.projectDetailFormGroup.controls['file_url'].patchValue(element.file_url);
              this.projectDetailFormGroup.controls['formula_id'].patchValue(element.formula_id);
              this.projectDetailFormGroup.controls['id'].patchValue(element.id);
              this.projectDetailFormGroup.controls['location_id'].patchValue(element.location_id);
              this.projectDetailFormGroup.controls['project_id'].patchValue(element.project_id);
              this.projectDetailFormGroup.controls['remark'].patchValue(element.remark);
              this.projectDetailFormGroup.controls['score1'].patchValue(element.score1);
              this.projectDetailFormGroup.controls['score2'].patchValue(element.score2);
              this.projectDetailFormGroup.controls['score3'].patchValue(element.score3);
              this.projectDetailFormGroup.controls['score4'].patchValue(element.score4);
              this.projectDetailFormGroup.controls['score5'].patchValue(element.score5);
              this.projectDetailFormGroup.controls['status_id'].patchValue(element.status_id); 
              if (element.file_url != '') {
                this.dataUrl = element.file_url;
                this.fileName = element.course_name;
                this.displayUrl = true;
              } else {
                this.displayUrl = false;
              }
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
      this.projectDetailFormGroup.controls['method'].setValue('save');
      this.projectDetailFormGroup.controls['file_base64'].setValue(this.fileBase64);
      this.projectDetailFormGroup.controls['user_id'].setValue(this.token);
      this.projectplanService.ApiProjectCourse(this.projectDetailFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data.status == 'S') {
            this.fileBase64 = ""; // JATE:Fix
            // this.projectDetailFormGroup.controls['file_base64'].setValue(""); 
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
    if (this.projectDetailFormGroup.controls['project_id'].value == null) {
      this.projectIdErrors = true;
    }
    if (this.projectDetailFormGroup.controls['course_id'].value == null) {
      this.courseIdErrors = true;
    }
    if (this.projectDetailFormGroup.controls['formula_id'].value == null) {
      this.formulaIdErrors = true;
    }
    if (this.projectDetailFormGroup.controls['location_id'].value == null) {
      this.locationIdErrors = true;
    }
    if (this.projectDetailFormGroup.controls['expert_id'].value == null) {
      this.expertIdErrors = true;
    }
    if (this.projectDetailFormGroup.controls['status_id'].value == null) {
      this.statusError = true;
    }
    return valid;
  }

  deleteFile() {
    this.projectDetailFormGroup.controls['file_url'].patchValue('');
    this.dataUrl = '';
    this.fileName = '';
  }

  changeListener($event): void {
    this.readThis($event.target);
    this.deleteFile();
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.fileBase64 = myReader.result;
    };
    myReader.readAsDataURL(file);
  }

}
