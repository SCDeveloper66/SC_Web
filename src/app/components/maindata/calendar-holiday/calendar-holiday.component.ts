import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { Router } from '@angular/router';
import { HolidayForm } from '../holiday/holiday.form';
import { MainDataService } from 'src/app/services/maindata/maindata.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar-holiday',
  templateUrl: './calendar-holiday.component.html',
  styleUrls: ['./calendar-holiday.component.scss']
})
export class CalendarHolidayComponent implements OnInit {
  token;
  currentUser: any;
  calEvents: any[];
  calOptions: any;
  itemFormGroup: FormGroup;
  holidayFormGroup: FormGroup;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private mainDataService: MainDataService,
    public datepipe: DatePipe
  ) {
    // if (this.authorizationService.currentUserValue) {
    //   this.currentUser = this.authorizationService.currentUserValue;
    //   const token = JSON.parse(this.localstorageService.getLocalStorage('tokenStandardCan'));
    //   this.token = token;
    // } else {
    //   this.authorizationService.Logout();
    //   location.reload(true);
    // }
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getHolidayList();
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
      // eventClick: (info) => {
      //   if (info.event.id) {
      //     if (info.event.type == '1') {
      //       this.router.navigate(['/meetingroom/bookingroom-detail', info.event.id]);
      //     } else if (info.event.type == '2') {
      //       this.router.navigate(['/bookingcar/bookingcar-detail', info.event.id]);
      //     }
      //   }
      // },
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
      }
    };
  }

  // private getCalEvents() {
  //   const holidayForm = new HolidayForm();
  //   this.itemFormGroup = this.formBuilder.group(
  //     holidayForm.HolidayFormBuilder
  //   );
  //   this.itemFormGroup.controls['method'].setValue('searchCalendar');
  //   this.itemFormGroup.controls['user_id'].setValue(this.token);
  //   this.homeService.ApiHome(this.itemFormGroup.getRawValue()).subscribe(
  //     (data) => {
  //       this.calEvents = [];
  //       if (data) {
  //         data.forEach(element => {
  //           this.calEvents.push({
  //             title: element.title,
  //             start: element.start,
  //             end: element.end,
  //             id: element.id,
  //             color: element.color,
  //             type: element.type
  //           });
  //         });
  //       }
  //       this.spinner.hide();
  //     }, (err) => {
  //       this.spinner.hide();
  //       this.alertService.error(err);
  //     });
  // }

  private getHolidayList() {
    this.spinner.show();
    const holidayForm = new HolidayForm();
    this.holidayFormGroup = this.formBuilder.group(
      holidayForm.HolidayFormBuilder
    );
    this.holidayFormGroup.controls['method'].setValue('calendarHoliday');
    this.holidayFormGroup.controls['year'].setValue((new Date()).getFullYear());
    // this.holidayFormGroup.controls['user_id'].setValue(this.token);
    this.mainDataService.ApiHoliday(this.holidayFormGroup.getRawValue()).subscribe(
      (data) => {
        this.calEvents = [];
        if (data) {
          data.forEach(element => {
            let bookingStartDate;
            if ((typeof element.date === 'string')
              && (element.date.indexOf('/') > -1)) {
              const str = element.date.split('/');
              let year = Number(str[2]);
              const month = Number(str[1]) - 1;
              const date = Number(str[0]);
              let newStartDate = new Date(year, month, date);
              bookingStartDate = this.datepipe.transform(newStartDate, 'yyyy-MM-dd');
            }
            this.calEvents.push({
              title: element.name,
              start: bookingStartDate,
              end: bookingStartDate,
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

}
