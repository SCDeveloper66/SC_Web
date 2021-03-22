import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { ReportService } from 'src/app/services/report/report.service';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import * as fileSaver from 'file-saver';
import { ReportEmpScoreForm } from './report-emp-score.form';
import { Table } from 'primeng/table';
import { RadioButton, RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-report-emp-score',
  templateUrl: './report-emp-score.component.html',
  styleUrls: ['./report-emp-score.component.scss']
})
export class ReportEmpScoreComponent implements OnInit {

  token;
  currentUser: any;
  dateFrom: Date;
  dateTo: Date;
  empCode;
  dep: string = "";
  deps: SelectItem[] = [];
  empfname: string = "";
  emplname: string = "";
  time;
  times: SelectItem[] = [];
  timeAttRealtimeFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  datasource: any[];
  datasourceImg: any[];
  cols: any[];
  colsImg: any[];
  //baseUrl = "https://jsoft-thailand.com/SCBackendApi/";
  baseUrl = environment.apiUrl;
  displayDialog = false;

  ReportEmpScoreFormGroup: FormGroup;

  selectedCategory: any = null;
  categories: any[] = [{ name: 'สรุป', key: '1' }, { name: 'รายละเอียด', key: '2' }];//, {name: 'Production', key: 'P'}, {name: 'Research', key: 'R'}

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private reportService: ReportService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    public datepipe: DatePipe,
    private http: HttpClient
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
    this.localstorageService.removeItem('datasourceImg-local');
  }

  ngOnInit(): void {
    this.selectedCategory = this.categories[0];

    this.dateFrom = null;// new Date();
    this.dateTo = null;// new Date();
    this.spinner.show();
    this.datasource = [];
    this.getMasterDDL();

    this.genColumn();

    const timeAttRealtimeForm = new ReportEmpScoreForm();
    this.timeAttRealtimeFormGroup = this.formBuilder.group(
      timeAttRealtimeForm.timeAttRealtimeFormBuilder
    );
    //this.getTimeAttRealtimeList();
    this.getReportEmpScore();
  }

  private genColumn() {
    console.log('selectedCategory : ' + this.selectedCategory.key);
    if (this.selectedCategory.key === '1') {
      this.cols = [

        { field: 'no', header: '#', sortable: true, colWidth: "60px", style: "text-center" },
        { field: 'dep_name', header: 'แผนก', sortable: true, colWidth: "200px", style: "" },
        { field: 'emp_code', header: 'รหัสพนักงาน', sortable: true, colWidth: "150px", style: "text-center" },
        { field: 'emp_name', header: 'ชื่อ - นามสกุล', sortable: true, colWidth: "200px", style: "" },
        { field: 'emp_score', header: 'คะแนน', sortable: true, colWidth: "150px", style: "text-center" },
      ];
    } else if (this.selectedCategory.key === '2') {
      this.cols = [

        { field: 'no', header: '#', sortable: true, colWidth: "60px", style: "text-center" },
        { field: 'eb_date', header: 'วันที่', sortable: true, colWidth: "100px", style: "" },
        { field: 'dep_name', header: 'แผนก', sortable: true, colWidth: "150px", style: "" },
        { field: 'detail', header: 'รายละเอียด', sortable: true, colWidth: "200px", style: "" },
        { field: 'emp_code', header: 'รหัสพนักงาน', sortable: true, colWidth: "150px", style: "text-center" },
        { field: 'emp_name', header: 'ชื่อ - นามสกุล', sortable: true, colWidth: "150px", style: "" },
        { field: 'emp_score', header: 'คะแนน', sortable: true, colWidth: "80px", style: "text-center" },
        { field: 'remark', header: 'หมายเหตุ', sortable: true, colWidth: "200px", style: "" },
      ];
    }
    this.colsImg = [
      { field: 'base64', header: 'รูป', sortable: true },
      { field: 'url', header: 'Link', sortable: true },
    ];
  }

  private getMasterDDL() {
    const timeAttRealtimeForm = new ReportEmpScoreForm();
    this.timeAttRealtimeFormGroup = this.formBuilder.group(
      timeAttRealtimeForm.timeAttRealtimeFormBuilder
    );
    const itemForm = new ReportEmpScoreForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.timeAttRealtimeFormBuilder
    );

    this.itemFormGroup.controls['method'].setValue('empscore-master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.ApiReportEmpScore(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          //console.log('dfadsfadfa')
          this.deps = [];
          this.times = [];
          data.department.forEach(m => {
            this.deps.push({ value: m.code, label: m.text });
          });
          // data.node.forEach(m => {
          //   this.times.push({ value: m.code, label: m.text });
          // });
        }
        this.spinner.hide();
      }, (err) => {
        this.alertService.error(err);
        this.spinner.hide();
      });
  }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.genColumn();
    this.getReportEmpScore();
  }


  showMapPopup(dataId, datalat, datalng) {
    this.datasourceImg = [];
    this.localstorageService.removeItem('datasourceImg-local');
    const itemForm = new ReportEmpScoreForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.timeAttRealtimeFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('detail');
    this.itemFormGroup.controls['id'].setValue(dataId);
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.reportService.ApiTimeAttRealtime(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          data.imgList.forEach(element => {
            this.datasourceImg.push({
              base64: element,
              url: 'https://www.google.com/maps/search/?api=1&query=' + datalat + ',' + datalng
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.alertService.error(err);
        this.spinner.hide();
      });

    this.displayDialog = true;
  }

  export() {
    this.spinner.show();
    const itemForm = new ReportEmpScoreForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.ReportEmpScoreFormBuilder
    );

    this.empCode = this.empCode == null ? '' : this.empCode;
    this.empfname = this.empfname == null ? '' : this.empfname;
    this.emplname = this.emplname == null ? '' : this.emplname;
    let dataDateFrom = this.dateFrom == null ? '' : this.datepipe.transform(this.dateFrom, 'dd/MM/yyyy');
    let dataDateTo = this.dateTo == null ? '' : this.datepipe.transform(this.dateTo, 'dd/MM/yyyy');
    let methods = "rpt-empscore-1";
    if (this.selectedCategory.key != '1') {
      methods = "rpt-empscore-2";
    }
    this.ReportEmpScoreFormGroup.controls['method'].setValue(methods);
    this.ReportEmpScoreFormGroup.controls['user_id'].setValue(this.token);
    this.ReportEmpScoreFormGroup.controls['start_date'].setValue(dataDateFrom);
    this.ReportEmpScoreFormGroup.controls['stop_date'].setValue(dataDateTo);
    // this.ReportEmpScoreFormGroup.controls['start_date'].setValue('');
    // this.ReportEmpScoreFormGroup.controls['stop_date'].setValue('');
    this.ReportEmpScoreFormGroup.controls['emp_code_from'].setValue(this.empCode);
    this.ReportEmpScoreFormGroup.controls['depart_from'].setValue(this.dep);
    this.ReportEmpScoreFormGroup.controls['fname'].setValue(this.empfname);
    this.ReportEmpScoreFormGroup.controls['lname'].setValue(this.emplname);

    const onSuccess = (data) => {
      this.spinner.hide();
      if (data.status == 'S') {
        console.log('export sucess');
        console.log(data);

        window.open(data.value);

      } else {
        this.alertService.error(data.message);
      }
    }
    this.ApiReportEmpScore(this.ReportEmpScoreFormGroup.getRawValue()).subscribe(data => onSuccess(data), error => {
      this.spinner.hide();
      console.log(error);
      this.alertService.error(error);
    })

  }

  private getReportEmpScore() {

    this.spinner.show();
    const reportEmpScoreForm = new ReportEmpScoreForm();
    this.ReportEmpScoreFormGroup = this.formBuilder.group(
      reportEmpScoreForm.ReportEmpScoreFormBuilder
    );
    this.empCode = this.empCode == null ? '' : this.empCode;
    this.empfname = this.empfname == null ? '' : this.empfname;
    this.emplname = this.emplname == null ? '' : this.emplname;
    let dataDateFrom = this.dateFrom == null ? '' : this.datepipe.transform(this.dateFrom, 'dd/MM/yyyy');
    let dataDateTo = this.dateTo == null ? '' : this.datepipe.transform(this.dateTo, 'dd/MM/yyyy');
    let methods = "empscore-1";
    if (this.selectedCategory.key != '1') {
      methods = "empscore-2";
    }
    this.ReportEmpScoreFormGroup.controls['method'].setValue(methods);
    this.ReportEmpScoreFormGroup.controls['user_id'].setValue(this.token);
    this.ReportEmpScoreFormGroup.controls['start_date'].setValue(dataDateFrom);
    this.ReportEmpScoreFormGroup.controls['stop_date'].setValue(dataDateTo);
    // this.ReportEmpScoreFormGroup.controls['start_date'].setValue('');
    // this.ReportEmpScoreFormGroup.controls['stop_date'].setValue('');
    this.ReportEmpScoreFormGroup.controls['emp_code_from'].setValue(this.empCode);
    this.ReportEmpScoreFormGroup.controls['depart_from'].setValue(this.dep);
    this.ReportEmpScoreFormGroup.controls['fname'].setValue(this.empfname);
    this.ReportEmpScoreFormGroup.controls['lname'].setValue(this.emplname);
    console.log(this.ReportEmpScoreFormGroup.getRawValue());

    this.ApiReportEmpScore(this.ReportEmpScoreFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          //console.log(data);
          let no = 1;
          data.forEach(element => {

            if (this.selectedCategory.key === '1') {
              this.datasource.push({
                no: no,
                dep_name: element.dep_name,
                emp_code: element.emp_code,
                emp_name: element.emp_name,
                emp_score: element.emp_score,
              });
            } else {
              this.datasource.push({

                no: no,
                eb_date: element.eb_date,
                dep_name: element.dep_name,
                detail: element.detail,
                emp_code: element.emp_code,
                emp_name: element.emp_name,
                emp_score: element.emp_score,
                remark: element.remark,
              });
            }
            no++;
          });
          //console.log(this.datasource);
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  ApiReportEmpScore(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/Report/', body);
  }
}
