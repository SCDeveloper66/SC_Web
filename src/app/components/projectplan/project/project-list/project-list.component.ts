import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { DatePipe } from '@angular/common';
import { ProjectplanService } from 'src/app/services/projectplan/projectplan.service';
import { ProjectListForm } from './project-list.form';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  token;
  currentUser: any;
  projectYearFrom;
  projectYearTo;
  projectYearFroms: SelectItem[] = [];
  projectYearTos: SelectItem[] = [];
  projectFrom;
  projectTo;
  projectFroms: SelectItem[] = [];
  projectTos: SelectItem[] = [];
  statusValue = '1';
  status: SelectItem[] = [];
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
    const projectListForm = new ProjectListForm();
    this.projectFormGroup = this.formBuilder.group(
      projectListForm.projectListFormBuilder
    );
    this.getMasterDDL();
    this.cols = [
      { field: 'number', header: '#', sortable: true },
      { field: 'year', header: 'ปีที่เริ่มโครงการ', sortable: true },
      { field: 'prj_name', header: 'ชื่อโครงการ', sortable: true },
      { field: 'dataDate', header: 'วันเวลา', sortable: true },
      { field: 'create_by', header: 'ผู้บันทึกโครงการ', sortable: true },
      { field: 'action', header: 'Action', sortable: true }
    ];
    this.status = [
      { label: 'ใช้งาน', value: '1' },
      { label: 'ไม่ใช้งาน', value: '0' }
    ];
    this.getProjectList();
  }

  private getMasterDDL() {
    const itemForm = new ProjectListForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.projectListFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.projectplanService.ApiProject(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.projectYearFroms = [];
          this.projectYearTos = [];
          this.projectFroms = [];
          this.projectTos = [];
          data.year.forEach(m => {
            this.projectYearFroms.push({ value: m.code, label: m.text });
            this.projectYearTos.push({ value: m.code, label: m.text });
          });
          data.project.forEach(m => {
            this.projectFroms.push({ value: m.code, label: m.text });
            this.projectTos.push({ value: m.code, label: m.text });
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
    this.projectYearFrom = this.projectYearFrom == null ? '' : this.projectYearFrom;
    this.projectYearTo = this.projectYearTo == null ? '' : this.projectYearTo;
    this.projectFrom = this.projectFrom == null ? '' : this.projectFrom;
    this.projectTo = this.projectTo == null ? '' : this.projectTo;
    this.statusValue = this.statusValue == null ? '' : this.statusValue;
    this.projectName = this.projectName == null ? '' : this.projectName;
    this.projectFormGroup.controls['method'].setValue('search');
    this.projectFormGroup.controls['year_from'].setValue(this.projectYearFrom);
    this.projectFormGroup.controls['year_to'].setValue(this.projectYearTo);
    this.projectFormGroup.controls['prj_from'].setValue(this.projectFrom);
    this.projectFormGroup.controls['prj_to'].setValue(this.projectTo);
    this.projectFormGroup.controls['prj_name'].setValue(this.projectName);
    this.projectFormGroup.controls['user_id'].setValue(this.token);
    this.projectFormGroup.controls['status_id'].setValue(this.statusValue);
 
    this.projectplanService.ApiProject(this.projectFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          data.forEach(element => {
            this.datasource.push({
              number: element.no,
              prj_id: element.prj_id,
              year: element.year,
              prj_name: element.prj_name,
              star_tdate: element.star_tdate,
              stop_date: element.stop_date,
              create_by: element.create_by,
              dataDate: element.star_tdate + ' ถึง ' + element.stop_date,
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
      this.router.navigate(['/projectplan/project-detail']);

    } else {
      this.router.navigate(['/projectplan/project-detail', prjId]);
    }
  }

}
