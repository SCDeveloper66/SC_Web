import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { LoginForm } from './login.form';
import { first } from 'rxjs/operators';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { HolidayForm } from '../maindata/holiday/holiday.form';
import { MainDataService } from 'src/app/services/maindata/maindata.service';
import { DatePipe } from '@angular/common';
import { AlertService } from 'src/app/services/global/alert.service';
import { LocalstorageService } from '../../services/global/localstorage.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error;
  returnUrl: string;
  isMobile: boolean = false;
  calEvents: any[];
  calOptions: any;
  itemFormGroup: FormGroup;
  holidayFormGroup: FormGroup;

  _platform: string = "";
  _token: string = "";
  _pageurl: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private authorizationService: AuthorizationService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private mainDataService: MainDataService,
    public datepipe: DatePipe,
    private alertService: AlertService,
    private localStorageService: LocalstorageService
  ) {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    const url = window.location.href;
    let arr = url.toLowerCase().split("platform=mobile");
    if (arr.length > 1) {
      // alert("1");
      this.authorizationService.Logout();
      this.localStorageService.setLocalStorage('sc_platform', "mobile");
      // alert("mobile");
      console.log("mobile");
      this.isMobile = true;
      this.route.queryParams.subscribe(params => {
        let token = params['token'];
        if (token != null) {
          this._token = token;
          console.log(this._token);
        }

        let pageurl = params['pageurl'];
        if (pageurl != null)
          this._pageurl = pageurl;

        if (this._token != '' && this._pageurl != '') {
          // this._pageurl = "/employee/employee";
          // alert(token);
          this.onLoginToken2();
        }
      });

      return;

    }

    arr = url.toLowerCase().split("platform=backend");
    if (arr.length > 1) {
      // alert("2");
      this.authorizationService.Logout();
      // this.localStorageService.setLocalStorage('sc_platform', "mobile");
      // alert("mobile");
      // console.log("mobile");
      this.isMobile = true;
      this.route.queryParams.subscribe(params => {
        let token = params['token'];
        if (token != null) {
          this._token = token;
          console.log(this._token);
        }

        let pageurl = params['pageurl'];
        if (pageurl != null)
          this._pageurl = pageurl;

          if (this._token != '' && this._pageurl != '') {
          // this._pageurl = "/employee/employee";
          // alert(token);
          this.onLoginToken3();
        }
      });

      return;

    }


    // alert("ooo");
    this.isMobile = false;

    let platform = this.localStorageService.getLocalStorage('sc_platform');
    if (platform != null && platform == "mobile") {
      this.authorizationService.Logout();
      // location.reload(true);
    }

    this.localStorageService.setLocalStorage('sc_platform', "");
    const loginForm = new LoginForm();
    this.loginForm = this.formBuilder.group(loginForm.loginFormBuilder);
    if (this.authorizationService.currentUserValue) {
      this.router.navigate(['/']);
    }



  }

  ngOnInit(): void {

    // this.spinner.show();
    // this.getHolidayList();
    // this.calEvents = [];
    // this.calOptions = {
    //   defaultDate: new Date(),
    //   header: {
    //     left: 'prev,next',
    //     center: 'title',
    //     right: 'dayGridMonth,timeGridWeek,timeGridDay'
    //   },
    //   editable: false,
    //   plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    //   eventTimeFormat: {
    //     hour: '2-digit',
    //     minute: '2-digit',
    //   }
    // };
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

  get f() { return this.loginForm.controls; }

  tokenLogin() {
    // alert(this.returnUrl);

    this.spinner.show();
    this.error = null;

    // alert(this.authorizationService.currentUserValue);

    this.authorizationService.LoginToken(this._token)
      .pipe(first())
      .subscribe(
        (data) => {
          this.spinner.hide();
          // alert(this._pageurl);
          // window.open('http://localhost:4200/Backend/#/home', '_parent');
          // window.open('https://scsmartconnect.com/Backend/#/' + this._pageurl, '_parent');
          // location.reload(true);

          this.router.navigate(["/" + this._pageurl]);
          setTimeout(function () {
            let url = window.location.href;
            // alert(url);
            location.reload(true);
          }, 1000);
          // location.reload(true);
        },
        (err) => {
          this.spinner.hide();
          this.error = err.ExceptionMessage == undefined ? err : err.ExceptionMessage;
        });
  }


  onLoginToken3() {
    // alert("onLoginToken3");
    this.spinner.show();
    this.error = null;
    this.authorizationService.LoginToken2(this._token)
      .pipe(first())
      .subscribe(
        (data) => {
          this.spinner.hide();
          this.router.navigate(["/" + this._pageurl]);
          // location.reload(true);
          setTimeout(function () {
            // let url = window.location.href;
            // alert(url);
            location.reload(true);
          }, 1000);
        },
        (err) => {
          this.spinner.hide();
          this.error = err.ExceptionMessage == undefined ? err : err.ExceptionMessage;
        });
  }

  onLoginToken2() {
    this.spinner.show();
    this.error = null;
    this.authorizationService.LoginToken2(this._token)
      .pipe(first())
      .subscribe(
        (data) => {
          this.spinner.hide();

          this.router.navigate(["/" + this._pageurl]);
          // location.reload(true);
          setTimeout(function () {
            // let url = window.location.href;
            // alert(url);
            location.reload(true);
          }, 300);
        },
        (err) => {
          this.spinner.hide();
          this.error = err.ExceptionMessage == undefined ? err : err.ExceptionMessage;
        });
  }

  onLogin() {
    // alert(this.returnUrl);

    this.spinner.show();
    this.error = null;
    if (this.loginForm.invalid) {
      this.error = 'User Name or Password is required.';
      this.spinner.hide();
      return false;
    }
    this.authorizationService.Login(this.f.userName.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.spinner.hide();
          this.router.navigate([this.returnUrl]);
          location.reload(true);
        },
        (err) => {
          this.spinner.hide();
          this.error = err.ExceptionMessage == undefined ? err : err.ExceptionMessage;
        });
  }

}
