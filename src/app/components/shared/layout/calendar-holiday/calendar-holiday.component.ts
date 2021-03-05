import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HolidayForm } from 'src/app/components/maindata/holiday/holiday.form';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { MainDataService } from 'src/app/services/maindata/maindata.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

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
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
      }
    };
  }

  private getHolidayList() {
    this.spinner.show();
    const holidayForm = new HolidayForm();
    this.holidayFormGroup = this.formBuilder.group(
      holidayForm.HolidayFormBuilder
    );
    this.holidayFormGroup.controls['method'].setValue('calendarHoliday');
    this.holidayFormGroup.controls['year'].setValue((new Date()).getFullYear());
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
