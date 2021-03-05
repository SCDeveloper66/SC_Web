import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { Router } from '@angular/router';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { ProjectplanService } from 'src/app/services/projectplan/projectplan.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { DatePipe } from '@angular/common';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProjectTrainingScheduleListForm } from './training-schedule.form';

@Component({
  selector: 'app-training-schedule-list',
  templateUrl: './training-schedule-list.component.html',
  styleUrls: ['./training-schedule-list.component.scss']
})
export class TrainingScheduleListComponent implements OnInit {
  token;
  currentUser: any;
  projectYear;
  projectYears: SelectItem[] = [];
  project;
  projects: SelectItem[] = [];
  status: SelectItem[] = [];
  statusValue = '1';
  trainingName;
  dateForm: Date;
  dateTo: Date;
  itemFormGroup: FormGroup;
  projectFormGroup: FormGroup;
  datasource: any[];
  cols: any[];
  minDate: Date;


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
    this.dateForm = new Date();
    this.dateTo = new Date();
    this.funcSelectDateFrom(this.dateForm);
    this.datasource = [];
    const projectListForm = new ProjectTrainingScheduleListForm();
    this.projectFormGroup = this.formBuilder.group(
      projectListForm.projectTrainingScheduleListFormBuilder
    );
    this.getMasterDDL();
    this.cols = [
      { field: 'number' },
      { field: 'trainingName' },
      { field: 'trainingDateFrom' },
      { field: 'trainingDateTo' },
      { field: 'trainingCourse' },
      { field: 'trainingExpense' },
      { field: 'action' }
    ];
    this.status = [
      { label: 'ใช้งาน', value: '1' },
      { label: 'ไม่ใช้งาน', value: '0' }
    ];
    this.getProjectList();
  }

  private getMasterDDL() {
    const itemForm = new ProjectTrainingScheduleListForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.projectTrainingScheduleListFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.projectplanService.ApiProjectTrainingSchedule(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.projectYears = [];
          this.projects = [];
          data.project_year.forEach(m => {
            this.projectYears.push({ value: m.code, label: m.text });
          });
          data.project_name.forEach(m => {
            this.projects.push({ value: m.code, label: m.text });
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
    this.trainingName = this.trainingName == null ? '' : this.trainingName;
    this.statusValue = this.statusValue == null ? '' : this.statusValue;
    this.projectFormGroup.controls['method'].setValue('searchTraining');
    this.projectFormGroup.controls['project_year'].setValue(this.projectYear);
    this.projectFormGroup.controls['project_name'].setValue(this.project);
    let dataDateFrom = this.dateForm == null ? '' : this.datepipe.transform(this.dateForm, 'dd/MM/yyyy');
    let dataDateTo = this.dateTo == null ? '' : this.datepipe.transform(this.dateTo, 'dd/MM/yyyy');
    this.projectFormGroup.controls['training_name'].setValue(this.trainingName);
    this.projectFormGroup.controls['date_form'].setValue(dataDateFrom);
    this.projectFormGroup.controls['date_to'].setValue(dataDateTo);
    this.projectFormGroup.controls['user_id'].setValue(this.token);
    this.projectFormGroup.controls['status_id'].setValue(this.statusValue);

    console.log(this.projectFormGroup.getRawValue());
    
    this.projectplanService.ApiProjectTrainingSchedule(this.projectFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          let i = 0;
          data.forEach(element => {
            i++;
            this.datasource.push({
              number: i,
              id: element.training_id,
              trainingName: element.training_name,
              trainingDateFrom: element.date_form,
              trainingDateTo: element.date_To,
              trainingCourse: element.course_count,
              trainingExpense: element.expense_total
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
      this.router.navigate(['/projectplan/project-training-schedule-detail']);

    } else {
      this.router.navigate(['/projectplan/project-training-schedule-detail', prjId]);
    }
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
    let dateTo = new Date(this.dateTo);
    if (dateFrom > dateTo) {
      this.dateTo = dateFrom;
    }
  }

}
