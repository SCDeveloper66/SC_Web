import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { HomeService } from 'src/app/services/home/home.service';
import { HomeForm } from './home.form';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Router } from '@angular/router';
import { DatePipe, JsonPipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  token;
  currentUser: any;
  homeFormGroup: FormGroup;
  datasource: any[];
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  calEvents: any[];
  calOptions: any;
  itemFormGroup: FormGroup;
  cols: any[];
  isAdmin: boolean = false;
  isDP: boolean = false;
  selectRoomList: string[];
  selectCarList: string[];

  filter_draft: boolean = false;
  filter_pending: boolean = false;
  filter_wait_dp: boolean = false;
  filter_approved: boolean = false;
  filter_cancel: boolean = false;

  // filterList: string[];

  // checked:boolean = true;

  modalConfirmReject: boolean = false;
  reasonReject: string = "";

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private homeService: HomeService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private datepipe: DatePipe,
    public translate: TranslateService
  ) {

    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      console.log(this.currentUser); //userId

      const token = JSON.parse(this.localStorageService.getLocalStorage('tokenStandardCan'));

      this.token = token;
      if (this.currentUser.userGroup == '3') {
        this.isAdmin = true;
        this.filter_pending = true;
      }
      if (this.currentUser.isDP == '1') {
        this.filter_wait_dp = true;
        this.isDP = true;
      }
      let langCode = this.localStorageService.getLocalStorage('language');
      this.translate.use(langCode);
      // alert(this.isAdmin);

    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }
    this.localStorageService.removeItem('datasource-local');

  }

  handleFilter($event, opt) {

    this.getDashBoardTableList();

    // alert(JSON.stringify(this.filter_draft));

    // var check_value = "0";
    // if ($event.checked)
    //   check_value = "1";

    // if (opt == "1") {
    //   this.filter_draft = check_value;
    // } else if (opt == "2") {
    //   this.filter_pending = check_value;
    // } else if (opt == "3") {
    //   this.filter_approved = check_value;
    // } else if (opt == "4") {
    //   this.filter_cancel = check_value;
    // }

  }

  ngOnInit(): void {
    this.spinner.show();
    this.datasource = [];
    const homeForm = new HomeForm();
    this.homeFormGroup = this.formBuilder.group(
      homeForm.homeFormBuilder
    );
    this.getDashBoardTableList();
    this.getCalEvents();
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

        let temp: string = info.event.id;
        let arr = temp.split('|')
        let type = arr[0];
        let id = arr[1];


        if (id) {
          if (type == '1') {
            this.router.navigate(['/meetingroom/bookingroom-detail', id]);
          } else if (type == '2') {
            this.router.navigate(['/bookingcar/bookingcar-detail', id]);
          }
        }
      },
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
      }
    };
    this.cols = [
      { field: 'no' },
      { field: 'booking_create' },
      { field: 'booking_type' },
      { field: 'booking_name' },
      { field: 'create_by' },
      { field: 'department' },
      { field: 'booking_date' },
      { field: 'booking_time' },
      { field: 'booking_status' },
      { field: 'approve_by' },
      { field: 'selection_sts' },
      { field: 'reason' },
    ];
  }

  private getCalEvents() {
    const itemForm = new HomeForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.homeFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('searchCalendar_v2');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.homeService.ApiHome(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {

        this.calEvents = [];
        if (data) {
          data.forEach(element => {
            this.calEvents.push({
              title: element.title,
              start: element.start,
              end: element.end,
              id: element.type + '|' + element.id,
              color: element.color,
              type: element.type
            });
          });
        }

        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  private getDashBoardTableList() {
    this.spinner.show();
    const homeForm = new HomeForm();
    this.homeFormGroup = this.formBuilder.group(
      homeForm.homeFormBuilder
    );

    this.homeFormGroup.controls['method'].setValue('searchWorkList');
    this.homeFormGroup.controls['user_id'].setValue(this.token);
    this.homeFormGroup.controls['draft'].setValue((this.filter_draft ? "1" : "0"));
    this.homeFormGroup.controls['pending'].setValue(this.filter_pending ? "1" : "0");
    this.homeFormGroup.controls['approve'].setValue(this.filter_approved ? "1" : "0");
    this.homeFormGroup.controls['cancel'].setValue(this.filter_cancel ? "1" : "0");
    this.homeFormGroup.controls['watiDP'].setValue(this.filter_wait_dp ? "1" : "0");
    // alert(JSON.stringify(this.homeFormGroup.getRawValue()));
    this.homeService.ApiHome(this.homeFormGroup.getRawValue()).subscribe(
      (data) => {
        console.log(data);
        this.datasource = [];
        this.selectRoomList = [];
        this.selectCarList = [];
        if (data) {
          // debugger;
          data.forEach(element => {
            // if (element.selection_sts == '1') {
            //   this.datasource.push({
            //     no: element.rowNo,
            //     tranId: element.TranId,
            //     booking_create: this.datepipe.transform(new Date(Number((element.create_date.replace('/Date(', '')).replace(')/', ''))), 'dd/MM/yyyy HH:mm'),
            //     type: element.type,
            //     booking_type: element.type_name,
            //     booking_name: element.topic,
            //     create_by: element.req_by,
            //     department: element.department,
            //     booking_date: element.date1,
            //     booking_time: element.date2,
            //     booking_status: element.status,
            //     sts_color: element.sts_color,
            //     approve_by: element.appr_by,
            //     selection_sts: element.selection_sts,
            //     reason: element.appr_remark
            //   });
            // }

            this.datasource.push({
              no: element.rowNo,
              tranId: element.TranId,
              booking_create: this.datepipe.transform(new Date(Number((element.create_date.replace('/Date(', '')).replace(')/', ''))), 'dd/MM/yyyy HH:mm'),
              type: element.type,
              booking_type: element.type_name,
              booking_name: element.topic,
              create_by: element.req_by,
              department: element.department,
              booking_date: element.date1,
              booking_time: element.date2,
              booking_status: element.status,
              sts_color: element.sts_color,
              approve_by: element.appr_by,
              selection_sts: element.selection_sts,
              reason: element.appr_remark
            });

            // if (element.type == '1') {
            //   if (element.selection_sts == '1'
            //     && element.status != 'Rejected'
            //     && element.status != 'Cancel') {
            //     this.selectRoomList.push(element.rowNo);
            //   }
            // } else if (element.type == '2') {
            //   if (element.selection_sts == '1'
            //     && element.status != 'Rejected'
            //     && element.status != 'Cancel') {
            //     this.selectCarList.push(element.rowNo);
            //   }
            // }
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  saveApprove() {
    this.spinner.show();
    const homeForm = new HomeForm();
    this.homeFormGroup = this.formBuilder.group(
      homeForm.homeFormBuilder
    );
    if (this.selectRoomList.length == 0 && this.selectCarList.length == 0) {
      this.spinner.hide();
      this.alertService.warning('กรุณาเลือกรายการที่ต้องการ !');
      return;
    }
    this.homeFormGroup.controls['method'].setValue('workListApproveSubmit');
    this.homeFormGroup.controls['select_room_list'].setValue(this.selectRoomList);
    this.homeFormGroup.controls['select_car_list'].setValue(this.selectCarList);
    this.homeFormGroup.controls['user_id'].setValue(this.token);
    // debugger;
    this.homeService.ApiHome(this.homeFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        this.selectRoomList = [];
        this.selectCarList = [];
        if (data.status == 'S') {
          this.alertService.success('success');
          this.localStorageService.removeItem('datasource-local');
          this.getDashBoardTableList();
        } else {
          this.getDashBoardTableList();
          this.alertService.error(data.message);
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });

  }

  saveCancel() {

    if (this.selectRoomList.length == 0 && this.selectCarList.length == 0) {
      this.spinner.hide();
      this.alertService.warning('กรุณาเลือกรายการที่ต้องการ !');
      return;
    }

    this.modalConfirmReject = true;
    this.reasonReject = "";
  }

  saveCancelConfirm() {
    // alert(this.reasonReject);
    this.modalConfirmReject = false;

    this.spinner.show();
    const homeForm = new HomeForm();
    this.homeFormGroup = this.formBuilder.group(
      homeForm.homeFormBuilder
    );

    this.homeFormGroup.controls['method'].setValue('workListCancelSubmit');
    this.homeFormGroup.controls['select_room_list'].setValue(this.selectRoomList);
    this.homeFormGroup.controls['select_car_list'].setValue(this.selectCarList);
    this.homeFormGroup.controls['user_id'].setValue(this.token);
    this.homeFormGroup.controls['remark'].setValue(this.reasonReject);
    // debugger;
    this.homeService.ApiHome(this.homeFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        this.selectRoomList = [];
        this.selectCarList = [];
        if (data.status == 'S') {
          this.alertService.success('success');
          this.localStorageService.removeItem('datasource-local');
          this.getDashBoardTableList();
        } else {
          this.alertService.error(data.message);
        }
        this.spinner.hide();
        this.modalConfirmReject = false;
      }, (err) => {
        this.spinner.hide();
        this.modalConfirmReject = false;
        this.alertService.error(err);
      });

  }

}
