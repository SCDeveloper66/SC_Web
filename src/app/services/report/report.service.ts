import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalstorageService } from '../global/localstorage.service';
import { Observable } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import { formatDate } from '@angular/common';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = environment.apiUrl;
  headers = new HttpHeaders().set('content-type', 'application/json');
  token;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localstorageService: LocalstorageService,
  ) {
    const token = JSON.parse(this.localstorageService.getLocalStorage('tokenStandardCan'));
    this.token = token;
  }

  ApiTimeAttRealtime(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/timeAttRealtime', body);
  }

  downloadFile(fileName: any, dataDate: string): Observable<any> {
    return this.http.get(this.baseUrl + 'api/timeAttRealtime?user_id=' + this.token + '&fileName=' + fileName + '&dataDate=' + dataDate, { responseType: 'blob' });
  }

  ApiTimeAttRealtimeFile(body: any) {
    return this.http.post(this.baseUrl + 'api/timeAttRealtime', body, { responseType: 'blob' });
  }

  public exportAsExcelFileCSS(json: any[], excelFileName: string,
    title1: string, title2: string): void {
    let headersArray = [
      'วันที่', 'เวลา', 'ผู้เข้าร่วมประชุม', 'สถานะ'
    ];
    let headersJson = [
      'checkin_date', 'checkin_time', 'emp_name', 'checkin_status'
    ];
    const header = headersArray;
    const data = json;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(excelFileName);
    // datarow1.mergeCells('A1:D1');
    // const title1 = 'Car Sell Report';
    // const title2 = 'Car Sell Report';
    let datarow1 = worksheet.addRow([title1]);
    datarow1.eachCell((cell) => {
      cell.alignment = { horizontal: 'center' };
      cell.font = { size: 14, bold: true };
    });
    let datarow2 = worksheet.addRow([title2]);
    datarow2.eachCell((cell) => {
      cell.alignment = { horizontal: 'center' };
      cell.font = { size: 12, bold: true };
    });
    worksheet.addRow([]);
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      // cell.font = { name: 'TH SarabunPSK', size: 16, bold: true };
      cell.alignment = { horizontal: 'center' };
    });
    data.forEach((element) => {
      let eachRow = [];
      headersJson.forEach((headers) => {
        eachRow.push(element[headers])
      });
      let datarow = worksheet.addRow(eachRow);
      datarow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        // cell.font = { name: 'TH SarabunPSK', size: 16 };
        cell.alignment = { wrapText: true };
      });
    });
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 15;
    // worksheet.getColumn(5).width = 20;
    // worksheet.getColumn(6).width = 20;
    // worksheet.getColumn(7).width = 120;
    worksheet.addRow([]);
    // Generate Excel File with given name
    worksheet.mergeCells('A1:D1');
    worksheet.mergeCells('A2:D2');
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      var dateName = formatDate(new Date(), 'yyyyMMdd_HHmmss', 'en');
      FileSaver.saveAs(blob, excelFileName + '_Export_' + dateName + EXCEL_EXTENSION);
    });
  }

}
