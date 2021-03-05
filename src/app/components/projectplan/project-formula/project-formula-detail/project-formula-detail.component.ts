import { element } from 'protractor';
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
import { ProjectFormulaDetailForm } from './project-formula.form';

@Component({
  selector: 'app-project-formula-detail',
  templateUrl: './project-formula-detail.component.html',
  styleUrls: ['./project-formula-detail.component.scss']
})
export class ProjectFormulaDetailComponent implements OnInit {
  token;
  currentUser: any;
  projectDetailId;
  formulas: SelectItem[] = [];
  projectDetailFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  detailData: any;
  datasourceRange: any[];
  colsRange: any[];
  datasourceValue: any[];
  colsValue: any[];
  rageTab: boolean = false;
  public fmlTypeErrors = false;

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
    this.localstorageService.removeItem('datasourceRange-local');
    this.localstorageService.removeItem('datasourceValue-local');
  }

  ngOnInit(): void {
    this.spinner.show();
    this.colsRange = [
      { field: 'score', header: 'Value', sortable: false, width: '200px' },
      { field: 'display', header: 'Text', sortable: false, width: '200px' },
      { field: 'action', header: 'Action', sortable: false, width: '120px' }
    ];
    this.colsValue = [
      { field: 'no', header: 'เกณฑ์ที่', sortable: false, width: '70px' },
      { field: 'value', header: 'ค่าคะแนนน้อยกว่าเท่ากับ', sortable: false },
      { field: 'text', header: 'ผลคะแนน', sortable: false },
      { field: 'action', header: 'Action', sortable: false, width: '100px' }
    ];
    this.getMasterDDL();
    const projectDetailForm = new ProjectFormulaDetailForm();
    this.projectDetailFormGroup = this.formBuilder.group(
      projectDetailForm.projectFormulaDetailFormBuilder
    );
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectDetailId = id;
      this.getDetail();
    }
    else {
      this.projectDetailFormGroup.controls['fml_input_type'].patchValue('1');
      this.changeRdo('1');
      this.datasourceRange = [];
      this.datasourceValue = [];
      this.spinner.hide();
    }
  }

  private getMasterDDL() {
    const itemForm = new ProjectFormulaDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.projectFormulaDetailFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.projectplanService.ApiProjectFormular(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.formulas = [];
          data.type.forEach(m => {
            this.formulas.push({ value: m.code, label: m.text });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.alertService.error(err);
        this.spinner.hide();
      });
  }

  get f() {
    if (this.projectDetailFormGroup.controls['fml_type'].value != null) {
      this.fmlTypeErrors = false;
    }
    return this.projectDetailFormGroup.controls;
  }

  private getDetail() {
    this.detailData = null;
    const projectDetailForm = new ProjectFormulaDetailForm();
    this.projectDetailFormGroup = this.formBuilder.group(
      projectDetailForm.projectFormulaDetailFormBuilder
    );
    this.projectDetailFormGroup.controls['method'].setValue('detail');
    this.projectDetailFormGroup.controls['fml_id'].setValue(this.projectDetailId ?? '');
    this.projectDetailFormGroup.controls['user_id'].setValue(this.token);
    this.projectplanService.ApiProjectFormular(this.projectDetailFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.detailData = data;
          if (this.projectDetailId) {
            this.projectDetailFormGroup.controls['fml_id'].patchValue(data.fml_id);
            this.projectDetailFormGroup.controls['fml_input_type'].patchValue(data.fml_input_type);
            this.projectDetailFormGroup.controls['fml_name'].patchValue(data.fml_name);
            this.projectDetailFormGroup.controls['fml_type'].patchValue(data.fml_type);
            this.projectDetailFormGroup.controls['range'].patchValue(data.star_tdate);
            this.projectDetailFormGroup.controls['value'].patchValue(data.stop_date);
            this.datasourceRange = data.range;
            this.datasourceValue = data.value;
            this.changeRdo(data.fml_input_type);
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
      this.projectDetailFormGroup.controls['method'].setValue('save');
      if (this.projectDetailFormGroup.controls['fml_input_type'].value == '2') {
        this.projectDetailFormGroup.controls['range'].setValue(this.datasourceRange);
      }
      this.projectDetailFormGroup.controls['value'].setValue(this.datasourceValue);
      this.projectDetailFormGroup.controls['user_id'].setValue(this.token);
      this.projectplanService.ApiProjectFormular(this.projectDetailFormGroup.getRawValue()).subscribe(
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
    if (this.projectDetailFormGroup.controls['fml_type'].value == null) {
      this.fmlTypeErrors = true;
    }
    return valid;
  }

  addRangeRow() {
    let count = this.datasourceRange.length;
    count = count + 1;
    this.datasourceRange.push({
      no: count.toString(),
      score: '',
      display: '',
    });
  }

  addValueRow() {
    let count = this.datasourceValue.length;
    count = count + 1;
    this.datasourceValue.push({
      no: count.toString(),
      value: '',
      text: '',
    });
  }

  deleteRangeRow(rowId) {
    let datasourceRangeNew: any[] = [];
    this.datasourceRange.forEach(element => {
      if (rowId != element.no) {
        datasourceRangeNew.push({
          no: element.no,
          score: element.score,
          display: element.display,
        });
      }
    });
    this.datasourceRange = datasourceRangeNew;
  }

  deleteValueRow(rowId) {
    let datasourceValueNew: any[] = [];
    this.datasourceValue.forEach(element => {
      if (rowId != element.no) {
        datasourceValueNew.push({
          no: element.no,
          value: element.value,
          text: element.text,
        });
      }
    });
    this.datasourceValue = [];
    let count = 1;
    datasourceValueNew.forEach(element => {
      this.datasourceValue.push({
        no: count.toString(),
        value: element.value,
        text: element.text,
      });
      count++;
    });
  }

  changeRdo(type) {
    if (type == '1') {
      this.rageTab = false;
    } else if (type == '2') {
      this.rageTab = true;
    }
  }

}
