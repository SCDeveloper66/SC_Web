import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { MainDataService } from 'src/app/services/maindata/maindata.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { HolidayForm } from '../maindata/holiday/holiday.form';
import { BookingRoomForm } from '../meetingroom/booking-room/booking-room-list/booking-room.form';
import { MeetingroomService } from 'src/app/services/meetingroom/meetingroom.service';
import { Observable, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar-meeting',
  templateUrl: './calendar-meeting.component.html',
  styleUrls: ['./calendar-meeting.component.scss']
})
export class CalendarMeetingComponent implements OnInit {
  calEvents: any[];
  calOptions: any;
  itemFormGroup: FormGroup;
  holidayFormGroup: FormGroup;
  meetingId;
  roomName;
  qrCode;
  roomTopic;
  private updateSubscription: Subscription;

  constructor(
    public globalVariableService: GlobalVariableService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private meetingroomService: MeetingroomService,
    public datepipe: DatePipe,
    private route: ActivatedRoute,
    private localStorageService: LocalstorageService
  ) {
  }

  ngOnInit(): void {
    this.meetingId = localStorage.getItem('calendar-metting');
    this.getRoomList();
    this.updateSubscription = interval(60000).subscribe(
      (val) => {
        this.getRoomList();
      }
    );
    // this.getRoomList();
    this.calEvents = [];
    this.calOptions = {
      // defaultDate: new Date(),
      defaultView: 'timeGridDay',
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: false,
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
      }
    };
  }

  private getRoomList() {
    this.spinner.show();
    const holidayForm = new BookingRoomForm();
    this.holidayFormGroup = this.formBuilder.group(
      holidayForm.bookingRoomFormBuilder
    );
    this.holidayFormGroup.controls['method'].setValue('search_room_calendar');
    this.holidayFormGroup.controls['id'].setValue(this.meetingId);
    this.meetingroomService.ApiBookingRoom(this.holidayFormGroup.getRawValue()).subscribe(
      (data) => {
        debugger;
        this.calEvents = [];
        if (data) {
          this.roomName = data.roomName;
          this.qrCode = data.qrCode;
          this.qrCode = data.qrCode != null ? 'data:image/png;base64,' + data.qrCode : null;
          this.roomTopic = data.roomTopic;
          data.dataList.forEach(element => {
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

}
