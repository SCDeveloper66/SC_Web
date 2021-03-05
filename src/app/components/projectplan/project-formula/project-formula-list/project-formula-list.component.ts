import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { ProjectplanService } from 'src/app/services/projectplan/projectplan.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { DatePipe } from '@angular/common';
import { ProjectFormulaListForm } from './project-formula.form';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-project-formula-list',
  templateUrl: './project-formula-list.component.html',
  styleUrls: ['./project-formula-list.component.scss']
})
export class ProjectFormulaListComponent implements OnInit {
  token;
  currentUser: any;
  projectFormula;
  projectFormulas: SelectItem[] = [];
  projectName;
  itemFormGroup: FormGroup;
  projectFormGroup: FormGroup;
  datasource: any[];
  cols: any[];

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
    const projectListForm = new ProjectFormulaListForm();
    this.projectFormGroup = this.formBuilder.group(
      projectListForm.projectFormulaListFormBuilder
    );
    this.getMasterDDL();
    this.cols = [
      { field: 'number', header: '#', sortable: true },
      { field: 'type_name', header: 'ประเภทการคำนวณ', sortable: true },
      { field: 'name', header: 'ชื่อสูตร', sortable: true },
      { field: 'action', header: 'Action', sortable: true }
    ];
    this.getProjectList();
  }

  private getMasterDDL() {
    const itemForm = new ProjectFormulaListForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.projectFormulaListFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.projectplanService.ApiProjectFormular(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.projectFormulas = [];
          data.type.forEach(m => {
            this.projectFormulas.push({ value: m.code, label: m.text });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.alertService.error(err);
        this.spinner.hide();
      });
  }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getProjectList();
  }

  private getProjectList() {
    this.spinner.show();
    this.localstorageService.removeItem('datasource-local');
    this.projectFormula = this.projectFormula == null ? '' : this.projectFormula;
    this.projectName = this.projectName == null ? '' : this.projectName;
    this.projectFormGroup.controls['method'].setValue('search');
    this.projectFormGroup.controls['fml_type'].setValue(this.projectFormula);
    this.projectFormGroup.controls['fml_name'].setValue(this.projectName);
    this.projectFormGroup.controls['user_id'].setValue(this.token);
    this.projectplanService.ApiProjectFormular(this.projectFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          data.forEach(element => {
            this.datasource.push({
              number: element.no,
              type_name: element.type_name,
              name: element.name,
              id: element.id,
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  projectDetail(prjId) {
    if (prjId == '') {
      this.router.navigate(['/projectplan/project-formula-detail']);

    } else {
      this.router.navigate(['/projectplan/project-formula-detail', prjId]);
    }
  }

}
