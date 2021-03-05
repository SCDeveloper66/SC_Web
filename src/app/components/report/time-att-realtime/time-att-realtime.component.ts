import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { DatePipe } from '@angular/common';
import { ReportService } from 'src/app/services/report/report.service';
import { TimeAttRealtimeForm } from './timeAttRealtime.form';
import { Table } from 'primeng/table';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-time-att-realtime',
  templateUrl: './time-att-realtime.component.html',
  styleUrls: ['./time-att-realtime.component.scss']
})
export class TimeAttRealtimeComponent implements OnInit {
  token;
  currentUser: any;
  dateFrom: Date;
  dateTo: Date;
  empCode;
  dep;
  deps: SelectItem[] = [];
  empfname;
  emplname;
  time;
  times: SelectItem[] = [];
  timeAttRealtimeFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  datasource: any[];
  datasourceImg: any[];
  cols: any[];
  colsImg: any[];
  baseUrl = environment.apiUrl;
  displayDialog = false;

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
    this.dateFrom = new Date();
    this.dateTo = new Date();
    this.spinner.show();
    this.datasource = [];
    this.getMasterDDL();
    this.cols = [
      { field: 'no', header: '#', sortable: true },
      { field: 'date', header: 'วันที่', sortable: true },
      { field: 'time', header: 'เวลา', sortable: true },
      { field: 'emp_name', header: 'พนักงาน', sortable: true },
      { field: 'depart_name', header: 'แผนก', sortable: true },
      { field: 'node_name', header: 'จุดลงเวลา', sortable: true },
      { field: 'url', header: 'Map', sortable: true },
      { field: 'node_name', header: 'จุดลงเวลา', sortable: true },
      { field: 'tar_type', header: 'รายละเอียด', sortable: true },
    ];
    this.colsImg = [
      { field: 'base64', header: 'รูป', sortable: true },
      { field: 'url', header: 'Link', sortable: true },
    ];
    const timeAttRealtimeForm = new TimeAttRealtimeForm();
    this.timeAttRealtimeFormGroup = this.formBuilder.group(
      timeAttRealtimeForm.timeAttRealtimeFormBuilder
    );
    this.getTimeAttRealtimeList();
  }

  private getMasterDDL() {
    const timeAttRealtimeForm = new TimeAttRealtimeForm();
    this.timeAttRealtimeFormGroup = this.formBuilder.group(
      timeAttRealtimeForm.timeAttRealtimeFormBuilder
    );
    const itemForm = new TimeAttRealtimeForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.timeAttRealtimeFormBuilder
    );

    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.reportService.ApiTimeAttRealtime(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.deps = [];
          this.times = [];
          data.department.forEach(m => {
            this.deps.push({ value: m.code, label: m.text });
          });
          data.node.forEach(m => {
            this.times.push({ value: m.code, label: m.text });
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
    this.getTimeAttRealtimeList();
  }

  private getTimeAttRealtimeList() {
    this.spinner.show();
    const timeAttRealtimeForm = new TimeAttRealtimeForm();
    this.timeAttRealtimeFormGroup = this.formBuilder.group(
      timeAttRealtimeForm.timeAttRealtimeFormBuilder
    );
    this.empCode = this.empCode == null ? '' : this.empCode;
    this.empfname = this.empfname == null ? '' : this.empfname;
    this.emplname = this.emplname == null ? '' : this.emplname;
    let dataDateFrom = this.dateFrom == null ? '' : this.datepipe.transform(this.dateFrom, 'yyyy-MM-dd');
    let dataDateTo = this.dateTo == null ? '' : this.datepipe.transform(this.dateTo, 'yyyy-MM-dd');
    this.timeAttRealtimeFormGroup.controls['method'].setValue('search');
    this.timeAttRealtimeFormGroup.controls['start_date'].setValue(dataDateFrom);
    this.timeAttRealtimeFormGroup.controls['stop_date'].setValue(dataDateTo);
    this.timeAttRealtimeFormGroup.controls['emp_code_from'].setValue(this.empCode);
    this.timeAttRealtimeFormGroup.controls['emp_code_to'].setValue(this.empCode);
    this.timeAttRealtimeFormGroup.controls['depart_from'].setValue(this.dep);
    this.timeAttRealtimeFormGroup.controls['depart_to'].setValue(this.dep);
    this.timeAttRealtimeFormGroup.controls['fname'].setValue(this.empfname);
    this.timeAttRealtimeFormGroup.controls['lname'].setValue(this.emplname);
    this.timeAttRealtimeFormGroup.controls['node_from'].setValue(this.time);
    this.timeAttRealtimeFormGroup.controls['node_to'].setValue(this.time);
    this.timeAttRealtimeFormGroup.controls['user_id'].setValue(this.token);
    this.reportService.ApiTimeAttRealtime(this.timeAttRealtimeFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          data.forEach(element => {
            this.datasource.push({
              id: element.id,
              no: element.no,
              date: element.date,
              time: element.time,
              emp_name: element.emp_name,
              depart_name: element.depart_name,
              node_name: element.node_name,
              tar_type: element.tar_type,
              m_lat: element.m_lat,
              m_long: element.m_long,
              url: 'https://www.google.com/maps/search/?api=1&query=' + element.m_lat + ',' + element.m_long,
              remark: element.remark
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  showMapPopup(dataId, datalat, datalng) {
    this.datasourceImg = [];
    this.localstorageService.removeItem('datasourceImg-local');
    const itemForm = new TimeAttRealtimeForm();
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
    const itemForm = new TimeAttRealtimeForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.timeAttRealtimeFormBuilder
    );
    this.empCode = this.empCode == null ? '' : this.empCode;
    this.empfname = this.empfname == null ? '' : this.empfname;
    this.emplname = this.emplname == null ? '' : this.emplname;
    let dataDateFrom = this.dateFrom == null ? '' : this.datepipe.transform(this.dateFrom, 'yyyy-MM-dd');
    let dataDateTo = this.dateTo == null ? '' : this.datepipe.transform(this.dateTo, 'yyyy-MM-dd');
    let newDate = new Date();
    let fileName = 'DATA_' + this.datepipe.transform(newDate, 'yyMMddHHmmss') + '.TAF';
    this.itemFormGroup.controls['method'].setValue('exportFile');
    this.itemFormGroup.controls['start_date'].setValue(dataDateFrom);
    this.itemFormGroup.controls['stop_date'].setValue(dataDateTo);
    this.itemFormGroup.controls['emp_code_from'].setValue(this.empCode);
    this.itemFormGroup.controls['emp_code_to'].setValue(this.empCode);
    this.itemFormGroup.controls['depart_from'].setValue(this.dep);
    this.itemFormGroup.controls['depart_to'].setValue(this.dep);
    this.itemFormGroup.controls['fname'].setValue(this.empfname);
    this.itemFormGroup.controls['lname'].setValue(this.emplname);
    this.itemFormGroup.controls['node_from'].setValue(this.time);
    this.itemFormGroup.controls['node_to'].setValue(this.time);
    this.itemFormGroup.controls['fileName'].setValue(fileName);
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.reportService.ApiTimeAttRealtimeFile(this.itemFormGroup.getRawValue()).subscribe(response => {
      const blob: any = new Blob([response], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, fileName);
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      this.alertService.error(err);
    });

    // this.reportService.downloadFile(fileName, dataDateFrom).subscribe(response => {
    //   const blob: any = new Blob([response], { type: 'text/plain' });
    //   const url = window.URL.createObjectURL(blob);
    //   fileSaver.saveAs(blob, fileName);
    // }, (err) => {
    //   this.spinner.hide();
    //   this.alertService.error(err);
    // });
  }

}
