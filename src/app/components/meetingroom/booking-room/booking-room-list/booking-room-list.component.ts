import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { BookingRoomForm } from './booking-room.form';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MeetingroomService } from 'src/app/services/meetingroom/meetingroom.service';
import { Table } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-booking-room-list',
  templateUrl: './booking-room-list.component.html',
  styleUrls: ['./booking-room-list.component.scss']
})
export class BookingRoomListComponent implements OnInit {
  token;
  currentUser: any;
  roomFrom;
  roomTo;
  statusAppFrom;
  statusAppTo;
  roomFroms: SelectItem[] = [];
  roomTos: SelectItem[] = [];
  statusAppFroms: SelectItem[] = [];
  statusAppTos: SelectItem[] = [];
  bookingRoomFormGroup: FormGroup;
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
    private meetingroomService: MeetingroomService,
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
      { field: 'no', header: '#', sortable: true },
      { field: 'room_name', header: 'ห้องประชุม', sortable: true },
      { field: 'time_start', header: 'วันเวลา', sortable: true },
      { field: 'person_total', header: 'จำนวนผู้เข้าร่วม', sortable: true },
      { field: 'create_by', header: 'ผู้จอง', sortable: true },
      { field: 'sts_code', header: 'สถานะอนุมัติ', sortable: true },
      { field: 'remark', header: 'เหตุผล', sortable: true },
      { field: 'action', header: 'Action', sortable: true },
    ];
    const bookingRoomForm = new BookingRoomForm();
    this.bookingRoomFormGroup = this.formBuilder.group(
      bookingRoomForm.bookingRoomFormBuilder
    );
    const itemForm = new BookingRoomForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.bookingRoomFormBuilder
    );
    this.getBookingRoomList();
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
          this.router.navigate(['/meetingroom/bookingroom-detail', info.event.id]);
        }
      },
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
      }
    };
  }


  private getMasterDDL() {
    const bookingRoomForm = new BookingRoomForm();
    this.bookingRoomFormGroup = this.formBuilder.group(
      bookingRoomForm.bookingRoomFormBuilder
    );
    this.bookingRoomFormGroup.controls['method'].setValue('master');
    this.bookingRoomFormGroup.controls['user_id'].setValue(this.token);
    this.meetingroomService.ApiBookingRoom(this.bookingRoomFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.roomFroms = [];
          this.roomTos = [];
          this.statusAppFroms = [];
          this.statusAppTos = [];
          data.room.forEach(m => {
            this.roomFroms.push({ value: m.code, label: m.text });
            this.roomTos.push({ value: m.code, label: m.text });
          });
          data.status.forEach(m => {
            this.statusAppFroms.push({ value: m.code, label: m.text });
            this.statusAppTos.push({ value: m.code, label: m.text });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.alertService.error(err);
        this.spinner.hide();
      });
  }

  private getCalEvents() {
    const itemForm = new BookingRoomForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.bookingRoomFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('search_all_calendar');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.meetingroomService.ApiBookingRoom(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        this.calEvents = [];
        if (data) {
          data.forEach(element => {
            // if (element.sts_text == 'Approved') {
            //   this.calEvents.push({
            //     title: element.room_name,
            //     start: element.time_start,
            //     end: element.time_stop,
            //     id: element.id,
            //     color: element.color
            //   });
            // }
            // alert(JSON.stringify(element));
            this.calEvents.push({
              title: element.room_name,
              start: element.time_start,
              end: element.time_stop,
              id: element.id,
              color: element.color,
              
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getBookingRoomList();
  }

  private getBookingRoomList() {
    this.spinner.show();
    const bookingRoomForm = new BookingRoomForm();
    this.bookingRoomFormGroup = this.formBuilder.group(
      bookingRoomForm.bookingRoomFormBuilder
    );
    this.roomFrom = this.roomFrom == null ? '' : this.roomFrom;
    this.roomTo = this.roomTo == null ? '' : this.roomTo;
    this.statusAppFrom = this.statusAppFrom == null ? '' : this.statusAppFrom;
    this.statusAppTo = this.statusAppTo == null ? '' : this.statusAppTo;
    let dataDateFrom = this.bookingDateFrom == null ? '' : this.datepipe.transform(this.bookingDateFrom, 'dd/MM/yyyy');
    let dataDateTo = this.bookingDateTo == null ? '' : this.datepipe.transform(this.bookingDateTo, 'dd/MM/yyyy');
    this.bookingRoomFormGroup.controls['method'].setValue('search');
    this.bookingRoomFormGroup.controls['room_from'].setValue(this.roomFrom);
    this.bookingRoomFormGroup.controls['room_to'].setValue(this.roomFrom); // ค่าเดียวกันกับ From
    this.bookingRoomFormGroup.controls['date_from'].setValue(dataDateFrom);
    this.bookingRoomFormGroup.controls['date_to'].setValue(dataDateTo);
    this.bookingRoomFormGroup.controls['status_from'].setValue(this.statusAppFrom);
    this.bookingRoomFormGroup.controls['status_to'].setValue(this.statusAppFrom); // ค่าเดียวกันกับ From
    this.bookingRoomFormGroup.controls['user_id'].setValue(this.token);
    this.meetingroomService.ApiBookingRoom(this.bookingRoomFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          data.forEach(element => {
            this.datasource.push({
              id: element.id,
              no: element.no,
              room_name: element.room_name,
              time_start: element.time_start,
              time_stop: element.time_stop,
              person_total: element.person_total,
              create_by: element.create_by,
              sts_code: element.sts_code,
              sts_text: element.sts_text,
              sts_color: element.sts_color,
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

  bookingRoomDetail(id) {
    if (id == 'ADD') {
      this.router.navigate(['/meetingroom/bookingroom-detail']);
    } else {
      this.router.navigate(['/meetingroom/bookingroom-detail', id]);
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
