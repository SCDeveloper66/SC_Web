import { Component, OnInit } from '@angular/core';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { MeetingroomService } from 'src/app/services/meetingroom/meetingroom.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BookingRoomDetailForm } from './booking-room-detail.form';
import { SelectItem } from 'primeng/api';
import { preserveWhitespacesDefault } from '@angular/compiler';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { BookingRoomSearchForm } from './booking-room-search.form';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { BookingRoomQRCodeForm } from './qrcode.form';
import * as fileSaver from 'file-saver';
import { ReportService } from 'src/app/services/report/report.service';

@Component({
  selector: 'app-booking-room-detail',
  templateUrl: './booking-room-detail.component.html',
  styleUrls: ['./booking-room-detail.component.scss']
})
export class BookingRoomDetailComponent implements OnInit {
  token;
  currentUser: any;
  bookingRoomId;
  detailTab: any;
  btnReject: boolean = false;
  btnApprove: boolean = false;
  btnCancel: boolean = false;
  btnSaveDraft: boolean = false;
  btnSaveSend: boolean = false;
  btnRevise: boolean = false;
  btnQRCode: boolean = false;
  bookingRoomDetailFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  roomLists: SelectItem[] = [];
  selectedColumns: string[];
  devicelist: any[];
  detailcols: any[];
  detailDatasource: any[];
  personlistcols: any[];
  personlistDatasource: any[];
  searchDataId;
  reasonCancel;
  public modalConfirmCancel = false;
  reasonReject;
  public modalConfirmReject = false;
  public modalConfirmApprove = false;
  public modalConfirmRevise = false;
  public modalAddPerson = false;
  searchEmpCode;
  searchFullName;
  searchSession;
  searchSessions: SelectItem[] = [];
  searchcols: any[];
  searchDatasource: any[];
  searchSelecteds: string[];
  public isEmployee = false;
  public isEmployeeSh = false;
  public isAdmin = false;
  public readOnly = false;
  public roomIdErrors = false;
  personType;
  public showPersonRequest = false;
  personRequestCode;
  personRequestName;
  fileName;
  qrCodeId;
  qrCodeReq;
  qrCodeStartDate;
  qrCodeStopDate;
  qrCodeTopic;
  qrRoomName;
  isMobile: boolean = false;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private meetingroomService: MeetingroomService,
    private employeeService: EmployeeService,
    private reportService: ReportService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      const token = JSON.parse(this.localstorageService.getLocalStorage('tokenStandardCan'));
      this.token = token;
      if (this.currentUser.userGroup == '1') {
        this.isEmployee = true;
      } else if (this.currentUser.userGroup == '2') {
        this.isEmployeeSh = true;
      } else if (this.currentUser.userGroup == '3') {
        this.isAdmin = true;
      }
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }

    let platform = this.localstorageService.getLocalStorage('sc_platform');
    if (platform != null && platform == "mobile") {
      this.isMobile = true;
    }

    this.localstorageService.removeItem('detailDatasource-local');
    this.localstorageService.removeItem('personlistDatasource-local');
    this.localstorageService.removeItem('searchDatasource-local');
  }

  ngOnInit(): void {
    this.spinner.show();
    const bookingRoomDeatilForm = new BookingRoomDetailForm();
    this.bookingRoomDetailFormGroup = this.formBuilder.group(
      bookingRoomDeatilForm.bookingRoomDetailFormBuilder
    );
    this.detailcols = [
      { field: 'depart', header: 'แผนก', sortable: true },
      { field: 'emp_name', header: 'ชื่อ-นามสกุล', sortable: true },
      { field: 'tel', header: 'เบอร์ติดต่อ', sortable: true },
      { field: 'email', header: 'อีเมล', sortable: true },
    ];
    this.personlistcols = [
      { field: 'checkin_date', header: 'วันที่', sortable: true },
      { field: 'checkin_time', header: 'เวลา', sortable: true },
      { field: 'emp_name', header: 'ผู้เข้าร่วมประชุม', sortable: true },
      { field: 'checkin_status', header: 'สถานะ', sortable: true },
    ];
    this.searchcols = [
      { field: 'depart', header: 'แผนก', sortable: true },
      { field: 'emp_name', header: 'ชื่อ-นามสกุล', sortable: true },
      { field: 'emp_tel', header: 'เบอร์ติดต่อ', sortable: true },
      { field: 'emp_email', header: 'อีเมล', sortable: true },
    ];
    this.getMasterDDl();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookingRoomId = id;
      this.getDetailTab();
    }
    else {
      this.bookingRoomId = '';
      this.getDetailTab();
      this.spinner.hide();
    }
  }

  private getMasterDDl() {
    const bookingRoomDeatilForm = new BookingRoomDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      bookingRoomDeatilForm.bookingRoomDetailFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.searchSessions = [];
          data.depart.forEach(m => {
            this.searchSessions.push({ value: m.value, label: m.text });
          });
        }
      }, (err) => {
        this.alertService.error(err);
      });
  }

  private getDetailTab() {
    this.detailTab = null;
    this.roomLists = [];
    this.selectedColumns = [];
    this.detailDatasource = [];
    this.personlistDatasource = [];
    const bookingRoomDeatilForm = new BookingRoomDetailForm();
    this.bookingRoomDetailFormGroup = this.formBuilder.group(
      bookingRoomDeatilForm.bookingRoomDetailFormBuilder
    );
    this.bookingRoomDetailFormGroup.controls['method'].setValue('detail');
    this.bookingRoomDetailFormGroup.controls['id'].setValue(this.bookingRoomId ?? '');
    this.bookingRoomDetailFormGroup.controls['user_id'].setValue(this.token);
    this.meetingroomService.ApiBookingRoom(this.bookingRoomDetailFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.readOnly = data.read_only;
          this.detailTab = data;
          this.btnReject = data.button.reject;
          this.btnApprove = data.button.approve;
          this.btnCancel = data.button.cancel;
          this.btnSaveDraft = data.button.save_draft;
          this.btnSaveSend = data.button.save_send;
          this.btnRevise = data.button.save_revise;
          this.btnQRCode = data.button.gen_qrCode;
          data.room_list.forEach(m => {
            this.roomLists.push({ value: m.code, label: m.text });
          });
          this.devicelist = data.device_list;
          data.device_list.forEach(element => {
            if (element.opt == true) {
              this.selectedColumns.push(element.id);
            }
          });

          if (this.bookingRoomId) {
            this.fileName = data.topic;
            this.qrCodeId = this.bookingRoomId;
            this.qrRoomName = data.room_name;
            this.qrCodeTopic = data.topic;
            this.qrCodeReq = data.date;
            this.qrCodeStartDate = data.start_time;
            this.qrCodeStopDate = data.stop_time;
            this.bookingRoomDetailFormGroup.controls['topic'].patchValue(data.topic);
            this.bookingRoomDetailFormGroup.controls['date'].patchValue(data.date);
            this.bookingRoomDetailFormGroup.controls['start_time'].patchValue(data.start_time);
            this.bookingRoomDetailFormGroup.controls['stop_time'].patchValue(data.stop_time);
            this.bookingRoomDetailFormGroup.controls['person_total'].patchValue(data.person_total);
            this.bookingRoomDetailFormGroup.controls['room_id'].patchValue(data.room_id);
            this.bookingRoomDetailFormGroup.controls['device_list'].patchValue(data.device_list);
            this.bookingRoomDetailFormGroup.controls['remark'].patchValue(data.remark);
            this.personRequestCode = data.br_request;
            this.personRequestName = data.br_request_name;
            if (this.readOnly) {
              this.bookingRoomDetailFormGroup.controls['topic'].disable();
              this.bookingRoomDetailFormGroup.controls['date'].disable();
              this.bookingRoomDetailFormGroup.controls['start_time'].disable();
              this.bookingRoomDetailFormGroup.controls['stop_time'].disable();
              this.bookingRoomDetailFormGroup.controls['person_total'].disable();
              this.bookingRoomDetailFormGroup.controls['room_id'].disable();
              this.bookingRoomDetailFormGroup.controls['remark'].disable();
            }

            data.emp_list.forEach(element => {
              this.detailDatasource.push({
                emp_code: element.emp_code,
                emp_name: element.emp_name,
                depart: element.depart,
                tel: element.tel,
                email: element.email,
                checkin_date: element.checkin_date,
                checkin_time: element.checkin_time,
                checkin_status: element.checkin_status
              });
              this.personlistDatasource.push({
                emp_code: element.emp_code,
                emp_name: element.emp_name,
                depart: element.depart,
                tel: element.tel,
                email: element.email,
                checkin_date: element.checkin_date,
                checkin_time: element.checkin_time,
                checkin_status: element.checkin_status
              });
            });
          }
          else {
            let dateNow = new Date();
            this.bookingRoomDetailFormGroup.controls['date'].patchValue(dateNow);
            this.bookingRoomDetailFormGroup.controls['start_time'].patchValue(this.datepipe.transform(dateNow, 'HH:mm'));
            this.bookingRoomDetailFormGroup.controls['stop_time'].patchValue(this.datepipe.transform(dateNow, 'HH:mm'));
          }
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  get f() {
    if (this.bookingRoomDetailFormGroup.controls['room_id'].value != null) {
      this.roomIdErrors = false;
    }
    return this.bookingRoomDetailFormGroup.controls;
  }

  searchId(dataKey) {
    this.localstorageService.removeItem('detailDatasource-local');
    this.localstorageService.removeItem('personlistDatasource-local');
    const bookingRoomDeatilForm = new BookingRoomDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      bookingRoomDeatilForm.bookingRoomDetailFormBuilder
    );
    if (dataKey != '') {
      this.itemFormGroup.controls['method'].setValue('search_by_id');
      this.itemFormGroup.controls['emp_code'].setValue(dataKey);
      this.itemFormGroup.controls['user_id'].setValue(this.token);
      this.meetingroomService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data) {
            data.forEach(element => {
              this.detailDatasource.push({
                emp_code: element.emp_code,
                emp_name: element.emp_code + ' ' + element.emp_name,
                depart: element.depart,
                tel: element.emp_tel,
                email: element.emp_email,
              });
              this.personlistDatasource.push({
                emp_code: element.emp_code,
                emp_name: element.emp_code + ' ' + element.emp_name,
                depart: element.depart,
                tel: element.emp_tel,
                email: element.emp_email,
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

  saveDraft() {
    if (this.getFormValidationErrors()) {
      this.spinner.show();
      this.devicelist.forEach(element => {
        if (this.selectedColumns.some((a) => a == element.id)) {
          element.opt = true;
        } else {
          element.opt = false;
        }
      });
      let bookingDate = '';
      if ((typeof this.bookingRoomDetailFormGroup.controls['date'].value === 'string')
        && (this.bookingRoomDetailFormGroup.controls['date'].value.indexOf('/') > -1)) {
        const str = this.bookingRoomDetailFormGroup.controls['date'].value.split('/');
        let year = Number(str[2]);
        const month = Number(str[1]) - 1;
        const date = Number(str[0]);
        let newStartDate = new Date(year, month, date);
        bookingDate = this.datepipe.transform(newStartDate, 'dd/MM/yyyy');
      } else {
        bookingDate = this.datepipe.transform(this.bookingRoomDetailFormGroup.controls['date'].value, 'dd/MM/yyyy');
      }
      this.bookingRoomDetailFormGroup.controls['date'].patchValue(bookingDate);
      this.bookingRoomDetailFormGroup.controls['br_request'].setValue(this.personRequestCode);
      if (this.bookingRoomDetailFormGroup.controls['id'].value == '0' || this.bookingRoomDetailFormGroup.controls['id'].value == '') {
        this.bookingRoomDetailFormGroup.controls['id'].setValue('');
        this.bookingRoomDetailFormGroup.controls['method'].setValue('save_draft');
        this.bookingRoomDetailFormGroup.controls['id'].setValue(this.bookingRoomId ?? '');
        this.bookingRoomDetailFormGroup.controls['device_list'].patchValue(this.devicelist);
        this.bookingRoomDetailFormGroup.controls['emp_list'].patchValue(this.detailDatasource);
        this.bookingRoomDetailFormGroup.controls['date'].patchValue(bookingDate);
        this.bookingRoomDetailFormGroup.controls['user_id'].setValue(this.token);
        this.meetingroomService.ApiBookingRoomSubmit(this.bookingRoomDetailFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('detailDatasource-local');
              this.localstorageService.removeItem('personlistDatasource-local');
              this.localstorageService.removeItem('searchDatasource-local');
              this.bookingRoomId = data.value;
              this.getDetailTab();
            } else {
              this.alertService.error(data.message);
            }
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
            this.alertService.error(err);
          }
        );
      } else {
        this.bookingRoomDetailFormGroup.controls['method'].setValue('save_draft');
        this.bookingRoomDetailFormGroup.controls['id'].setValue(this.bookingRoomId ?? '');
        this.bookingRoomDetailFormGroup.controls['device_list'].patchValue(this.devicelist);
        this.bookingRoomDetailFormGroup.controls['emp_list'].patchValue(this.detailDatasource);
        this.bookingRoomDetailFormGroup.controls['user_id'].setValue(this.token);
        this.meetingroomService.ApiBookingRoomSubmit(this.bookingRoomDetailFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('detailDatasource-local');
              this.localstorageService.removeItem('personlistDatasource-local');
              this.localstorageService.removeItem('searchDatasource-local');
              this.getDetailTab();
            } else {
              this.alertService.error(data.message);
            }
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
            this.alertService.error(err);
          }
        );
      }
    } else {
      return false;
    }
  }

  genarateQRCode() {
    this.spinner.show();
    const itemForm = new BookingRoomQRCodeForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.bookingRoomQRCodeFormBuilder
    );
    let fileName = 'QRCode_' + this.fileName + '.JPG';
    this.itemFormGroup.controls['method'].setValue('QRCode');
    this.itemFormGroup.controls['id'].setValue(this.qrCodeId);
    this.itemFormGroup.controls['room_name'].setValue(this.qrRoomName);
    this.itemFormGroup.controls['topic'].setValue(this.qrCodeTopic);
    this.itemFormGroup.controls['req_date'].setValue(this.qrCodeReq);
    this.itemFormGroup.controls['start_date'].setValue(this.qrCodeStartDate);
    this.itemFormGroup.controls['stop_date'].setValue(this.qrCodeStopDate);
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.meetingroomService.ApiQRCodeFile(this.itemFormGroup.getRawValue()).subscribe(response => {
      const blob: any = new Blob([response], { type: 'image/jpg' });
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, fileName);
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      this.alertService.error(err);
    });
  }

  saveSend() {
    if (this.getFormValidationErrors()) {
      this.spinner.show();
      this.devicelist.forEach(element => {
        if (this.selectedColumns.some((a) => a == element.id)) {
          element.opt = true;
        } else {
          element.opt = false;
        }
      });
      let bookingDate = '';
      if ((typeof this.bookingRoomDetailFormGroup.controls['date'].value === 'string')
        && (this.bookingRoomDetailFormGroup.controls['date'].value.indexOf('/') > -1)) {
        const str = this.bookingRoomDetailFormGroup.controls['date'].value.split('/');
        let year = Number(str[2]);
        const month = Number(str[1]) - 1;
        const date = Number(str[0]);
        let newStartDate = new Date(year, month, date);
        bookingDate = this.datepipe.transform(newStartDate, 'dd/MM/yyyy');
      } else {
        bookingDate = this.datepipe.transform(this.bookingRoomDetailFormGroup.controls['date'].value, 'dd/MM/yyyy');
      }
      this.bookingRoomDetailFormGroup.controls['date'].patchValue(bookingDate);

      if (this.bookingRoomDetailFormGroup.controls['id'].value == '0' || this.bookingRoomDetailFormGroup.controls['id'].value == '') {
        this.bookingRoomDetailFormGroup.controls['id'].setValue('');
        this.bookingRoomDetailFormGroup.controls['method'].setValue('save_send');
        this.bookingRoomDetailFormGroup.controls['id'].setValue(this.bookingRoomId ?? '');
        this.bookingRoomDetailFormGroup.controls['device_list'].patchValue(this.devicelist);
        this.bookingRoomDetailFormGroup.controls['emp_list'].patchValue(this.detailDatasource);
        this.bookingRoomDetailFormGroup.controls['user_id'].setValue(this.token);
        this.bookingRoomDetailFormGroup.controls['br_request'].setValue(this.personRequestCode);
        this.meetingroomService.ApiBookingRoomSubmit(this.bookingRoomDetailFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('detailDatasource-local');
              this.localstorageService.removeItem('personlistDatasource-local');
              this.localstorageService.removeItem('searchDatasource-local');
              this.bookingRoomId = data.value;
              if (this.isAdmin == true) {
                this.saveApprove();
              } else {
                this.getDetailTab();
              }
            } else {
              this.spinner.hide();
              this.alertService.error(data.message);
            }
          },
          (err) => {
            this.spinner.hide();
            this.alertService.error(err);
          }
        );
      } else {
        this.bookingRoomDetailFormGroup.controls['method'].setValue('save_send');
        this.bookingRoomDetailFormGroup.controls['id'].setValue(this.bookingRoomId ?? '');
        this.bookingRoomDetailFormGroup.controls['device_list'].patchValue(this.devicelist);
        this.bookingRoomDetailFormGroup.controls['emp_list'].patchValue(this.detailDatasource);
        this.bookingRoomDetailFormGroup.controls['user_id'].setValue(this.token);
        this.bookingRoomDetailFormGroup.controls['br_request'].setValue(this.personRequestCode);
        this.meetingroomService.ApiBookingRoomSubmit(this.bookingRoomDetailFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('detailDatasource-local');
              this.localstorageService.removeItem('personlistDatasource-local');
              this.localstorageService.removeItem('searchDatasource-local');
              this.getDetailTab();
            } else {
              this.alertService.error(data.message);
            }
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
            this.alertService.error(err);
          }
        );
      }
    } else {
      return false;
    }
  }

  getFormValidationErrors() {
    let valid = true;
    Object.keys(this.bookingRoomDetailFormGroup.controls).forEach(key => {
      this.bookingRoomDetailFormGroup.controls[key].markAsDirty();
      this.bookingRoomDetailFormGroup.controls[key].markAsTouched();
      this.bookingRoomDetailFormGroup.controls[key].markAsPending();
      const controlErrors: ValidationErrors = this.bookingRoomDetailFormGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
        valid = false;
      }
    });
    if (this.bookingRoomDetailFormGroup.controls['room_id'].value == null) {
      this.roomIdErrors = true;
    }
    if (this.bookingRoomDetailFormGroup.controls['start_time'].value != '') {
      let start_time = this.bookingRoomDetailFormGroup.controls['start_time'].value;
      let timeFrom = Number(start_time.substring(0, 2));
      let stop_time = this.bookingRoomDetailFormGroup.controls['stop_time'].value;
      let timeTo = Number(stop_time.substring(0, 2));
      if (timeFrom > timeTo) {
        this.alertService.warning('เวลา ไม่ถูกต้อง');
        valid = false;
      }
    }
    return valid;
  }

  cancelBookignRoom() {
    this.reasonCancel = '';
    this.modalConfirmCancel = true;
  }

  saveReviseBookingRoom() {
    // if (this.reasonCancel != null && this.reasonCancel != '') {
    this.modalConfirmRevise = false;
    this.spinner.show();
    const bookingRoomDeatilForm = new BookingRoomDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      bookingRoomDeatilForm.bookingRoomDetailFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('save_revise');
    this.itemFormGroup.controls['id'].setValue(this.bookingRoomId ?? '');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.meetingroomService.ApiBookingRoomSubmit(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data.status == 'S') {
          this.alertService.success('success');
          this.localstorageService.removeItem('detailDatasource-local');
          this.localstorageService.removeItem('personlistDatasource-local');
          this.localstorageService.removeItem('searchDatasource-local');
          this.getDetailTab();
          // this.router.navigate(['/meetingroom/bookingroom']);
          // this.router.navigate(['/meetingroom/bookingroom-detail', this.bookingRoomId]);
        } else {
          this.alertService.error(data.message);
        }
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      }
    );
    // } else {
    //   this.alertService.error('ระบุ เหตุผล');
    //   return false;
    // }
  }

  saveCancelBookingRoom() {
    if (this.reasonCancel != null && this.reasonCancel != '') {
      this.modalConfirmCancel = false;
      this.spinner.show();
      const bookingRoomDeatilForm = new BookingRoomDetailForm();
      this.itemFormGroup = this.formBuilder.group(
        bookingRoomDeatilForm.bookingRoomDetailFormBuilder
      );
      this.itemFormGroup.controls['method'].setValue('save_cancel');
      this.itemFormGroup.controls['id'].setValue(this.bookingRoomId ?? '');
      this.itemFormGroup.controls['remark'].setValue(this.reasonCancel);
      this.itemFormGroup.controls['user_id'].setValue(this.token);
      this.meetingroomService.ApiBookingRoomSubmit(this.itemFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data.status == 'S') {
            this.alertService.success('success');
            this.localstorageService.removeItem('detailDatasource-local');
            this.localstorageService.removeItem('personlistDatasource-local');
            this.localstorageService.removeItem('searchDatasource-local');
            this.getDetailTab();
          } else {
            this.alertService.error(data.message);
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          this.alertService.error(err);
        }
      );
    } else {
      this.alertService.error('ระบุ เหตุผล');
      return false;
    }
  }

  rejectBookignRoom() {
    this.reasonReject = '';
    this.modalConfirmReject = true;
  }

  saveRejectBookingRoom() {
    if (this.reasonReject != null && this.reasonReject != '') {
      this.modalConfirmReject = false;
      this.spinner.show();
      const bookingRoomDeatilForm = new BookingRoomDetailForm();
      this.itemFormGroup = this.formBuilder.group(
        bookingRoomDeatilForm.bookingRoomDetailFormBuilder
      );
      this.itemFormGroup.controls['method'].setValue('save_reject');
      this.itemFormGroup.controls['id'].setValue(this.bookingRoomId ?? '');
      this.itemFormGroup.controls['remark'].setValue(this.reasonReject);
      this.itemFormGroup.controls['user_id'].setValue(this.token);
      this.meetingroomService.ApiBookingRoomSubmit(this.itemFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data.status == 'S') {
            this.alertService.success('success');
            this.localstorageService.removeItem('detailDatasource-local');
            this.localstorageService.removeItem('personlistDatasource-local');
            this.localstorageService.removeItem('searchDatasource-local');
            this.getDetailTab();
          } else {
            this.alertService.error(data.message);
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          this.alertService.error(err);
        }
      );
    } else {
      this.alertService.error('ระบุ เหตุผล');
      return false;
    }
  }

  approveBookignRoom() {
    if (this.getFormValidationErrors()) {
      this.modalConfirmApprove = true;
    }
  }

  reviseBookignRoom() {
    this.modalConfirmRevise = true;
  }

  saveApprove() {
    this.modalConfirmApprove = false;
    this.spinner.show();
    if (this.bookingRoomId == '') {
      this.saveSend();
    } else {
      const bookingRoomDeatilForm = new BookingRoomDetailForm();
      this.itemFormGroup = this.formBuilder.group(
        bookingRoomDeatilForm.bookingRoomDetailFormBuilder
      );
      this.itemFormGroup.controls['method'].setValue('save_approve');
      this.itemFormGroup.controls['id'].setValue(this.bookingRoomId ?? '');
      this.itemFormGroup.controls['user_id'].setValue(this.token);
      this.meetingroomService.ApiBookingRoomSubmit(this.itemFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data.status == 'S') {
            this.alertService.success('success');
            this.localstorageService.removeItem('detailDatasource-local');
            this.localstorageService.removeItem('personlistDatasource-local');
            this.localstorageService.removeItem('searchDatasource-local');
            this.getDetailTab();
          } else {
            this.alertService.error(data.message);
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          this.alertService.error(err);
        }
      );
    }
  }

  addPerson(type) {
    this.personType = type;
    this.localstorageService.removeItem('searchDatasource-local');
    this.modalAddPerson = true;
    this.getMasterDDl();
    this.searchDatasource = [];
    this.searchEmpCode = '';
    this.searchFullName = '';
    this.searchSession = null;
    this.searchSelecteds = [];
  }

  serachDataPerson() {
    this.localstorageService.removeItem('searchDatasource-local');
    this.spinner.show();
    const bookingRoomSearchForm = new BookingRoomSearchForm();
    this.searchFormGroup = this.formBuilder.group(
      bookingRoomSearchForm.bookingRoomSearchFormBuilder
    );
    this.searchFormGroup.controls['method'].setValue('search_by_popup');
    this.searchFormGroup.controls['emp_code'].setValue(this.searchEmpCode);
    this.searchFormGroup.controls['emp_name'].setValue(this.searchFullName);
    this.searchFormGroup.controls['sh_id'].setValue(this.searchSession);
    this.searchFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.searchFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.searchDatasource = [];
          data.forEach(element => {
            this.searchDatasource.push({
              emp_code: element.emp_code,
              depart: element.depart,
              emp_name: element.emp_name,
              emp_tel: element.emp_tel,
              emp_email: element.emp_email,
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.alertService.error(err);
      });

  }

  saveAddPerson() {
    this.modalAddPerson = false;
    this.localstorageService.removeItem('detailDatasource-local');
    this.localstorageService.removeItem('personlistDatasource-local');
    if (this.personType == 'person') {
      this.searchDatasource.forEach(element => {
        if (this.searchSelecteds.some((a) => a == element.emp_code)) {
          this.detailDatasource.push({
            emp_code: element.emp_code,
            emp_name: element.emp_code + ' ' + element.emp_name,
            depart: element.depart,
            tel: element.emp_tel,
            email: element.emp_email,
          });
          this.personlistDatasource.push({
            emp_code: element.emp_code,
            emp_name: element.emp_code + ' ' + element.emp_name,
            depart: element.depart,
            tel: element.emp_tel,
            email: element.emp_email,
          });
        }
      });
    } else {
      this.searchDatasource.forEach(element => {
        if (this.searchSelecteds.some((a) => a == element.emp_code)) {
          this.personRequestCode = element.emp_code;
          this.personRequestName = element.emp_name;
        }
      });
    }
  }

  deleteDetailDatasource(empCode) {
    this.localstorageService.removeItem('detailDatasource-local');
    this.localstorageService.removeItem('personlistDatasource-local');
    let detailDatasourceNew = [];
    let personlistDatasourceNew = [];

    this.detailDatasource.forEach(element => {
      if (empCode != element.emp_code) {
        detailDatasourceNew.push({
          emp_code: element.emp_code,
          emp_name: element.emp_name,
          depart: element.depart,
          tel: element.tel,
          email: element.email,
        });
        personlistDatasourceNew.push({
          emp_code: element.emp_code,
          emp_name: element.emp_name,
          depart: element.depart,
          tel: element.tel,
          email: element.email,
        });
      }
    });
    this.detailDatasource = [];
    this.personlistDatasource = [];
    this.detailDatasource = detailDatasourceNew;
    this.personlistDatasource = personlistDatasourceNew;
  }

  export() {
    this.spinner.show();
    // const bookingRoomDeatilForm = new BookingRoomDetailForm();
    // this.itemFormGroup = this.formBuilder.group(
    //   bookingRoomDeatilForm.bookingRoomDetailFormBuilder
    // );
    // this.itemFormGroup.controls['method'].setValue('export');
    // this.itemFormGroup.controls['id'].setValue(this.bookingRoomId ?? '');
    // this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.reportService.exportAsExcelFileCSS(this.personlistDatasource, 'BookingRoom', this.qrCodeTopic, this.qrCodeStartDate + ' - ' + this.qrCodeStopDate);
    this.spinner.hide();
    // this.meetingroomService.ApiBookingRoomFile(this.itemFormGroup.getRawValue()).subscribe(response => {
    //   const blob: any = new Blob([response], { type: 'text/plain' });
    //   const url = window.URL.createObjectURL(blob);
    //   fileSaver.saveAs(blob, fileName);
    //   this.spinner.hide();
    // }, (err) => {
    //   this.spinner.hide();
    //   this.alertService.error(err);
    // });
  }

}
