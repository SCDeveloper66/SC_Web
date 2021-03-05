import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { BookingcarService } from 'src/app/services/bookingcar/bookingcar.service';
import { SelectItem } from 'primeng/api';
import { BookingCarlistForm } from './bookingcar-list.form';
import { Table } from 'primeng/table';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import thLocale from '@fullcalendar/core/locales/th';

@Component({
  selector: 'app-bookingcar-list',
  templateUrl: './bookingcar-list.component.html',
  styleUrls: ['./bookingcar-list.component.scss']
})
export class BookingcarListComponent implements OnInit {
  token;
  currentUser: any;
  typeFrom;
  numberFrom;
  reasonFrom;
  statusFrom;
  typeFroms: SelectItem[] = [];
  numberFroms: SelectItem[] = [];
  reasonFroms: SelectItem[] = [];
  statusFroms: SelectItem[] = [];
  bookingCarFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  bookingDateFrom: Date;
  bookingDateTo: Date;
  datasource: any[];
  cols: any[];
  calEvents: any[];
  calOptions: any;
  minDate: Date;
  isMobile: boolean = false;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private bookingcarService: BookingcarService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    public datepipe: DatePipe,
    private router: Router,

  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      const token = JSON.parse(this.localstorageService.getLocalStorage('tokenStandardCan'));
      this.token = token;
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }

    let platform = this.localstorageService.getLocalStorage('sc_platform');
    if (platform != null && platform == "mobile") {
      this.isMobile = true;
    }

    this.localstorageService.removeItem('datasource-local');
  }

  ngOnInit(): void {
    this.spinner.show();
    this.bookingDateFrom = new Date();
    this.bookingDateTo = new Date();
    this.funcSelectDateFrom(this.bookingDateFrom);
    this.datasource = [];
    this.getMasterDDL();
    this.getCalEvents();
    this.cols = [
      { field: 'no', header: '#', sortable: true, width: '50px' },
      { field: 'start_date', header: 'วันที่-เวลา เดินทางไป', sortable: true, width: '150px' },
      { field: 'stop_date', header: 'วันที่-เวลา เดินทางกลับ', sortable: true, width: '150px' },
      { field: 'use_car_reason', header: 'เหตุผลเดินทาง', sortable: true, width: '150px' },
      { field: 'dest_name', header: 'สถานที่ปลายทาง', sortable: true, width: '150px' },
      { field: 'person_total', header: 'จำนวนผู้ร่วมเดินทาง', sortable: true, width: '100px' },
      { field: 'car_type', header: 'ประเภทรถ', sortable: true, width: '150px' },
      { field: 'car_license', header: 'ทะเบียนรถ', sortable: true, width: '150px' },
      { field: 'emp_list', header: 'ผู้ร่วมเดินทาง', sortable: true, width: '300px' },
      { field: 'sts_code', header: 'สถานะอนุมัติ', sortable: true, width: '100px' },
    ];
    const bookingCarForm = new BookingCarlistForm();
    this.bookingCarFormGroup = this.formBuilder.group(
      bookingCarForm.bookingCarlistFormBuilder
    );
    this.getBookingCarList();
    this.calEvents = [];
    this.calOptions = {
      defaultDate: new Date(),
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: false,
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      eventClick: (info) => {
        if (info.event.id) {
          this.router.navigate(['/bookingcar/bookingcar-detail', info.event.id]);
        }
      },
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
      }
    };
  }

  private getMasterDDL() {
    const bookingRoomForm = new BookingCarlistForm();
    this.itemFormGroup = this.formBuilder.group(
      bookingRoomForm.bookingCarlistFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.bookingcarService.ApiCar(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.typeFroms = [];
          this.numberFroms = [];
          this.reasonFroms = [];
          this.statusFroms = [];
          data.car_type.forEach(m => {
            this.typeFroms.push({ value: m.code, label: m.text });
          });
          // data.car_license.forEach(m => {
          //   this.numberFroms.push({ value: m.code, label: m.text });
          // });
          data.car_reason.forEach(m => {
            this.reasonFroms.push({ value: m.code, label: m.text });
          });
          data.car_status.forEach(m => {
            this.statusFroms.push({ value: m.code, label: m.text });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.alertService.error(err);
        this.spinner.hide();
      });
  }

  private getCalEvents() {
    const itemForm = new BookingCarlistForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.bookingCarlistFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('search');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.bookingcarService.ApiBookingCar(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        this.calEvents = [];
        if (data) {
          data.forEach(element => {
            if (element.sts_text == 'Approved') {
              this.calEvents.push({
                title: element.use_car_reason + ' ' + element.car_license,
                start: element.start_date,
                end: element.stop_date,
                id: element.id,
                color: element.color
              });
            }
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  carTypeChange(event) {
    this.numberFroms = [];
    this.getDataByCarType(event.value, this.numberFroms);
  }
  private getDataByCarType(carType, cars) {
    const bookingRoomForm = new BookingCarlistForm();
    this.itemFormGroup = this.formBuilder.group(
      bookingRoomForm.bookingCarlistFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.itemFormGroup.controls['carTypes'].setValue(carType);
    this.bookingcarService.ApiCar(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          data.car_license.forEach(m => {
            cars.push({ value: m.code, label: m.text });
          });
        }
      }, (err) => {
        this.alertService.error(err);
      });
  }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getBookingCarList();
  }

  private getBookingCarList() {
    this.spinner.show();
    const bookingCarForm = new BookingCarlistForm();
    this.bookingCarFormGroup = this.formBuilder.group(
      bookingCarForm.bookingCarlistFormBuilder
    );
    this.typeFrom = this.typeFrom == null ? '' : this.typeFrom;
    this.numberFrom = this.numberFrom == null ? '' : this.numberFrom;
    this.reasonFrom = this.reasonFrom == null ? '' : this.reasonFrom;
    this.statusFrom = this.statusFrom == null ? '' : this.statusFrom;
    let dataDateFrom = this.bookingDateFrom == null ? '' : this.datepipe.transform(this.bookingDateFrom, 'dd/MM/yyyy');
    let dataDateTo = this.bookingDateTo == null ? '' : this.datepipe.transform(this.bookingDateTo, 'dd/MM/yyyy');
    this.bookingCarFormGroup.controls['method'].setValue('search');
    this.bookingCarFormGroup.controls['car_type_from'].setValue(this.typeFrom);
    this.bookingCarFormGroup.controls['car_type_to'].setValue(this.typeFrom);
    this.bookingCarFormGroup.controls['car_license_from'].setValue(this.numberFrom);
    this.bookingCarFormGroup.controls['car_license_to'].setValue(this.numberFrom);
    this.bookingCarFormGroup.controls['date_from'].setValue(dataDateFrom);
    this.bookingCarFormGroup.controls['date_to'].setValue(dataDateTo);
    this.bookingCarFormGroup.controls['car_reason_from'].setValue(this.reasonFrom);
    this.bookingCarFormGroup.controls['car_reason_to'].setValue(this.reasonFrom);
    this.bookingCarFormGroup.controls['status_from'].setValue(this.statusFrom);
    this.bookingCarFormGroup.controls['status_to'].setValue(this.statusFrom);
    this.bookingCarFormGroup.controls['user_id'].setValue(this.token);
    this.bookingcarService.ApiBookingCar(this.bookingCarFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          data.forEach(element => {
            this.datasource.push({
              id: element.id,
              no: element.no,
              start_date: element.start_date,
              stop_date: element.stop_date,
              car_type: element.car_type,
              car_license: element.car_license,
              person_total: element.person_total,
              req_by: element.req_by,
              sts_code: element.sts_code,
              sts_text: element.sts_text,
              sts_color: element.sts_color,
              appr_reason: element.appr_reason,
              use_car_reason: element.use_car_reason,
              dest_name: element.dest_name,
              emp_list: element.emp_list,
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  bookingCarDetail(id) {
    if (id == 'ADD') {
      this.router.navigate(['/bookingcar/bookingcar-detail']);
    } else {
      this.router.navigate(['/bookingcar/bookingcar-detail', id]);
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
    let dateTo = new Date(this.bookingDateTo);
    if (dateFrom > dateTo) {
      this.bookingDateTo = dateFrom;
    }
  }

}
