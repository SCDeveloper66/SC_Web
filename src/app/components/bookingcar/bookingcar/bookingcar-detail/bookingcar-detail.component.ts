import { BookingCarSearchForm } from './bookingcar-search.form';
import { BookingCarDetailForm } from './bookingcar-detail.form';
import { SelectItem } from 'primeng/api';
import { BookingcarService } from './../../../../services/bookingcar/bookingcar.service';
import { DatePipe } from '@angular/common';
import { AlertService } from './../../../../services/global/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalstorageService } from './../../../../services/global/localstorage.service';
import { EmployeeService } from './../../../../services/employee/employee.service';
import { GlobalVariableService } from './../../../../services/global/global-variable.service';
import { FormGroup, ValidationErrors, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';

@Component({
  selector: 'app-bookingcar-detail',
  templateUrl: './bookingcar-detail.component.html',
  styleUrls: ['./bookingcar-detail.component.scss']
})
export class BookingcarDetailComponent implements OnInit {
  token;
  currentUser: any;
  bookingCarId;
  searchDataId;
  types: SelectItem[] = [];
  numbers: SelectItem[] = [];
  reasons: SelectItem[] = [];
  destinations: SelectItem[] = [];
  detailData: any;

  btnReject: boolean = false;
  btnApprove: boolean = false;
  btnCancel: boolean = false;
  btnSaveDraft: boolean = false;
  btnSaveSend: boolean = false;
  btnSaveUpdate: boolean = false;

  bookingCarDetailFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  reasonCancel;
  reasonReject;
  public modalConfirmCancel = false;
  public modalConfirmReject = false;
  public modalConfirmApprove = false;
  public modalAddPerson = false;
  detailcols: any[];
  detailDatasource: any[];
  searchEmpCode;
  searchFullName;
  searchSession;
  searchSessions: SelectItem[] = [];
  searchcols: any[];
  searchDatasource: any[];
  searchSelecteds: string[];
  public readOnly = false;
  minDate: Date;
  public carTypeIdErrors = false;
  public carIdErrors = false;
  public reasonIdErrors = false;
  public destIdErrors = false;
  public isEmployee = false;
  public isEmployeeSh = false;
  public isAdmin = false;
  personType;
  public showPersonRequest = false;
  personRequestCode;
  personRequestName;
  isMobile: boolean = false;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private bookingcarService: BookingcarService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      const token = JSON.parse(this.localstorageService.getLocalStorage('tokenStandardCan'));
      this.token = token;
      debugger;
      if (this.currentUser.userGroup == '1') {
        this.isEmployee = true;
        // this.personRequestCode = this.currentUser.userCode;
        // this.personRequestName = this.currentUser.fullname;
      } else if (this.currentUser.userGroup == '2') {
        this.isEmployeeSh = true;

      } else if (this.currentUser.userGroup == '3') {
        this.isAdmin = true;
      }

      this.personRequestCode = this.currentUser.userCode;
      this.personRequestName = this.currentUser.fullname;

    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }

    let platform = this.localstorageService.getLocalStorage('sc_platform');
    if (platform != null && platform == "mobile") {
      this.isMobile = true;
    }

    this.localstorageService.removeItem('detailDatasource-local');
    this.localstorageService.removeItem('searchDatasource-local');
  }

  ngOnInit(): void {
    this.spinner.show();
    const bookingCarDeatilForm = new BookingCarDetailForm();
    this.bookingCarDetailFormGroup = this.formBuilder.group(
      bookingCarDeatilForm.bookingCarDetailFormBuilder
    );
    this.detailcols = [
      { field: 'depart', header: 'แผนก', sortable: true },
      { field: 'emp_name', header: 'ชื่อ-นามสกุล', sortable: true },
      { field: 'tel', header: 'เบอร์ติดต่อ', sortable: true },
      { field: 'email', header: 'อีเมล', sortable: true },
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
      this.bookingCarId = id;
      this.getDetail();
    }
    else {
      this.bookingCarId = '';
      this.getDetail();
      this.spinner.hide();
    }
  }

  private getMasterDDl() {
    const bookingCarDeatilForm = new BookingCarDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      bookingCarDeatilForm.bookingCarDetailFormBuilder
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

  private getDetail() {
    this.detailData = null;
    this.detailDatasource = [];
    this.types = [];
    this.numbers = [];
    this.reasons = [];
    this.destinations = [];
    const bookingRoomDeatilForm = new BookingCarDetailForm();
    this.bookingCarDetailFormGroup = this.formBuilder.group(
      bookingRoomDeatilForm.bookingCarDetailFormBuilder
    );
    this.bookingCarDetailFormGroup.controls['method'].setValue('detail');
    this.bookingCarDetailFormGroup.controls['id'].setValue(this.bookingCarId ?? '');
    this.bookingCarDetailFormGroup.controls['user_id'].setValue(this.token);
    this.bookingcarService.ApiBookingCar(this.bookingCarDetailFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.readOnly = data.read_only;
          this.detailData = data;
          this.btnReject = data.button.reject;
          this.btnApprove = data.button.approve;
          this.btnCancel = data.button.cancel;
          this.btnSaveDraft = data.button.save_draft;
          this.btnSaveSend = data.button.save_send;
          this.btnSaveUpdate = data.button.save_revise;
          data.car_type.forEach(m => {
            this.types.push({ value: m.code, label: m.text });
          });
          data.car_license.forEach(m => {
            this.numbers.push({ value: m.code, label: m.text });
          });
          data.car_reason.forEach(m => {
            this.reasons.push({ value: m.code, label: m.text });
          });
          data.car_dest.forEach(m => {
            this.destinations.push({ value: m.code, label: m.text });
          });
          if (this.bookingCarId) {
            this.bookingCarDetailFormGroup.controls['topic'].patchValue(data.topic);
            this.bookingCarDetailFormGroup.controls['start_date'].patchValue(data.start_date);
            this.bookingCarDetailFormGroup.controls['start_time'].patchValue(data.start_time);
            this.bookingCarDetailFormGroup.controls['stop_date'].patchValue(data.stop_date);
            this.bookingCarDetailFormGroup.controls['stop_time'].patchValue(data.stop_time);
            this.bookingCarDetailFormGroup.controls['person_total'].patchValue(data.person_total);
            this.bookingCarDetailFormGroup.controls['car_type_id'].patchValue(data.car_type_id);
            this.bookingCarDetailFormGroup.controls['car_id'].patchValue(data.car_id);
            this.bookingCarDetailFormGroup.controls['reason_id'].patchValue(data.reason_id);
            this.bookingCarDetailFormGroup.controls['dest_id'].patchValue(data.dest_id);
            this.bookingCarDetailFormGroup.controls['remark'].patchValue(data.remark);
            this.personRequestCode = data.bc_request;
            this.personRequestName = data.bc_request_name;
            if (this.readOnly) {
              this.bookingCarDetailFormGroup.controls['topic'].disable();
              this.bookingCarDetailFormGroup.controls['start_date'].disable();
              this.bookingCarDetailFormGroup.controls['start_time'].disable();
              this.bookingCarDetailFormGroup.controls['stop_date'].disable();
              this.bookingCarDetailFormGroup.controls['stop_time'].disable();
              this.bookingCarDetailFormGroup.controls['person_total'].disable();
              this.bookingCarDetailFormGroup.controls['car_type_id'].disable();
              this.bookingCarDetailFormGroup.controls['car_id'].disable();
              this.bookingCarDetailFormGroup.controls['reason_id'].disable();
              this.bookingCarDetailFormGroup.controls['dest_id'].disable();
              this.bookingCarDetailFormGroup.controls['remark'].disable();
            }
            data.emp_list.forEach(element => {
              this.detailDatasource.push({
                emp_code: element.emp_code,
                emp_name: element.emp_name,
                depart: element.depart,
                tel: element.tel,
                email: element.email,
              });
            });
          }
          else {
            let dateNow = new Date();
            this.bookingCarDetailFormGroup.controls['start_date'].patchValue(dateNow);
            this.bookingCarDetailFormGroup.controls['stop_date'].patchValue(dateNow);
            this.bookingCarDetailFormGroup.controls['start_time'].patchValue(this.datepipe.transform(dateNow, 'HH:mm'));
            this.bookingCarDetailFormGroup.controls['stop_time'].patchValue(this.datepipe.transform(dateNow, 'HH:mm'));
            this.funcSelectDateFrom(dateNow);
          }
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  get f() {
    if (this.bookingCarDetailFormGroup.controls['car_type_id'].value != null) {
      this.carTypeIdErrors = false;
    }
    if (this.bookingCarDetailFormGroup.controls['car_id'].value != null) {
      this.carIdErrors = false;
    }
    if (this.bookingCarDetailFormGroup.controls['reason_id'].value != null) {
      this.reasonIdErrors = false;
    }
    if (this.bookingCarDetailFormGroup.controls['dest_id'].value != null) {
      this.destIdErrors = false;
    }
    return this.bookingCarDetailFormGroup.controls;
  }

  rejectBookignCar() {
    this.reasonReject = '';
    this.modalConfirmReject = true;
  }

  approveBookignCar() {
    if (this.getFormValidationErrors()) {
      this.modalConfirmApprove = true;
    }
  }

  cancelBookignCar() {
    this.reasonCancel = '';
    this.modalConfirmCancel = true;
  }

  saveRejectBookingCar() {
    if (this.reasonReject != null && this.reasonReject != '') {
      this.modalConfirmReject = false;
      this.spinner.show();
      const bookingCarDeatilForm = new BookingCarDetailForm();
      this.itemFormGroup = this.formBuilder.group(
        bookingCarDeatilForm.bookingCarDetailFormBuilder
      );
      this.itemFormGroup.controls['method'].setValue('save_reject');
      this.itemFormGroup.controls['id'].setValue(this.bookingCarId ?? '');
      this.itemFormGroup.controls['remark'].setValue(this.reasonReject);
      this.itemFormGroup.controls['user_id'].setValue(this.token);
      this.bookingcarService.ApiBookCarSubmit(this.itemFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data.status == 'S') {
            this.alertService.success('success');
            this.localstorageService.removeItem('detailDatasource-local');
            this.localstorageService.removeItem('searchDatasource-local');
            this.getDetail();
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

  saveApprove() {
    this.modalConfirmApprove = false;
    this.spinner.show();
    if (this.bookingCarId == '') {
      this.saveSend();
    }
    else {
      const bookingCarDeatilForm = new BookingCarDetailForm();
      this.itemFormGroup = this.formBuilder.group(
        bookingCarDeatilForm.bookingCarDetailFormBuilder
      );

      if (this.isEmployeeSh == true) {
        this.itemFormGroup.controls['method'].setValue('save_approve_sh');
      } else {
        this.itemFormGroup.controls['method'].setValue('save_approve_admin');
      }
      this.itemFormGroup.controls['id'].setValue(this.bookingCarId ?? '');
      this.itemFormGroup.controls['user_id'].setValue(this.token);

      // console.log(this.itemFormGroup.getRawValue());
      // return;
      this.bookingcarService.ApiBookCarSubmit(this.itemFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data.status == 'S') {
            this.alertService.success('success');
            this.localstorageService.removeItem('detailDatasource-local');
            this.localstorageService.removeItem('searchDatasource-local');
            this.getDetail();
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

  saveCancelBookingCar() {
    if (this.reasonCancel != null && this.reasonCancel != '') {
      this.modalConfirmCancel = false;
      this.spinner.show();
      const bookingCarDeatilForm = new BookingCarDetailForm();
      this.itemFormGroup = this.formBuilder.group(
        bookingCarDeatilForm.bookingCarDetailFormBuilder
      );
      this.itemFormGroup.controls['method'].setValue('save_cancel');
      this.itemFormGroup.controls['id'].setValue(this.bookingCarId ?? '');
      this.itemFormGroup.controls['remark'].setValue(this.reasonCancel);
      this.itemFormGroup.controls['user_id'].setValue(this.token);
      this.bookingcarService.ApiBookCarSubmit(this.itemFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data.status == 'S') {
            this.alertService.success('success');
            this.localstorageService.removeItem('detailDatasource-local');
            this.localstorageService.removeItem('searchDatasource-local');
            this.getDetail();
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

  saveUpdate() {
    if (this.getFormValidationErrors()) {
      this.spinner.show();
      let bookingStartDate = '';
      let bookingStopDate = '';
      if ((typeof this.bookingCarDetailFormGroup.controls['start_date'].value === 'string')
        && (this.bookingCarDetailFormGroup.controls['start_date'].value.indexOf('/') > -1)) {
        const str = this.bookingCarDetailFormGroup.controls['start_date'].value.split('/');
        let year = Number(str[2]);
        const month = Number(str[1]) - 1;
        const date = Number(str[0]);
        let newStartDate = new Date(year, month, date);
        bookingStartDate = this.datepipe.transform(newStartDate, 'dd/MM/yyyy');
      } else {
        bookingStartDate = this.datepipe.transform(this.bookingCarDetailFormGroup.controls['start_date'].value, 'dd/MM/yyyy');
      }
      this.bookingCarDetailFormGroup.controls['start_date'].patchValue(bookingStartDate);

      if ((typeof this.bookingCarDetailFormGroup.controls['stop_date'].value === 'string')
        && (this.bookingCarDetailFormGroup.controls['stop_date'].value.indexOf('/') > -1)) {
        const str = this.bookingCarDetailFormGroup.controls['stop_date'].value.split('/');
        let year = Number(str[2]);
        const month = Number(str[1]) - 1;
        const date = Number(str[0]);
        let newStopDate = new Date(year, month, date);
        bookingStopDate = this.datepipe.transform(newStopDate, 'dd/MM/yyyy');
      } else {
        bookingStopDate = this.datepipe.transform(this.bookingCarDetailFormGroup.controls['stop_date'].value, 'dd/MM/yyyy');
      }
      this.bookingCarDetailFormGroup.controls['stop_date'].patchValue(bookingStopDate);
      this.bookingCarDetailFormGroup.controls['bc_request'].setValue(this.personRequestCode);
      this.bookingCarDetailFormGroup.controls['method'].setValue('save_update');
      if (this.bookingCarDetailFormGroup.controls['id'].value == '0' || this.bookingCarDetailFormGroup.controls['id'].value == '') {
        this.bookingCarDetailFormGroup.controls['id'].setValue(this.bookingCarId ?? '');
        this.bookingCarDetailFormGroup.controls['emp_list'].patchValue(this.detailDatasource);
        this.bookingCarDetailFormGroup.controls['user_id'].setValue(this.token);
        this.bookingcarService.ApiBookCarSubmit(this.bookingCarDetailFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('detailDatasource-local');
              this.localstorageService.removeItem('searchDatasource-local');
              this.bookingCarId = data.value;
              this.getDetail();
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
        this.bookingCarDetailFormGroup.controls['id'].setValue(this.bookingCarId ?? '');
        this.bookingCarDetailFormGroup.controls['emp_list'].patchValue(this.detailDatasource);
        this.bookingcarService.ApiBookCarSubmit(this.bookingCarDetailFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('detailDatasource-local');
              this.localstorageService.removeItem('searchDatasource-local');
              this.getDetail();
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

  saveDraft() {
    if (this.getFormValidationErrors()) {
      this.spinner.show();
      let bookingStartDate = '';
      let bookingStopDate = '';
      if ((typeof this.bookingCarDetailFormGroup.controls['start_date'].value === 'string')
        && (this.bookingCarDetailFormGroup.controls['start_date'].value.indexOf('/') > -1)) {
        const str = this.bookingCarDetailFormGroup.controls['start_date'].value.split('/');
        let year = Number(str[2]);
        const month = Number(str[1]) - 1;
        const date = Number(str[0]);
        let newStartDate = new Date(year, month, date);
        bookingStartDate = this.datepipe.transform(newStartDate, 'dd/MM/yyyy');
      } else {
        bookingStartDate = this.datepipe.transform(this.bookingCarDetailFormGroup.controls['start_date'].value, 'dd/MM/yyyy');
      }
      this.bookingCarDetailFormGroup.controls['start_date'].patchValue(bookingStartDate);

      if ((typeof this.bookingCarDetailFormGroup.controls['stop_date'].value === 'string')
        && (this.bookingCarDetailFormGroup.controls['stop_date'].value.indexOf('/') > -1)) {
        const str = this.bookingCarDetailFormGroup.controls['stop_date'].value.split('/');
        let year = Number(str[2]);
        const month = Number(str[1]) - 1;
        const date = Number(str[0]);
        let newStopDate = new Date(year, month, date);
        bookingStopDate = this.datepipe.transform(newStopDate, 'dd/MM/yyyy');
      } else {
        bookingStopDate = this.datepipe.transform(this.bookingCarDetailFormGroup.controls['stop_date'].value, 'dd/MM/yyyy');
      }
      this.bookingCarDetailFormGroup.controls['stop_date'].patchValue(bookingStopDate);
      this.bookingCarDetailFormGroup.controls['bc_request'].setValue(this.personRequestCode);
      this.bookingCarDetailFormGroup.controls['method'].setValue('save_draft');
      if (this.bookingCarDetailFormGroup.controls['id'].value == '0' || this.bookingCarDetailFormGroup.controls['id'].value == '') {
        this.bookingCarDetailFormGroup.controls['id'].setValue(this.bookingCarId ?? '');
        this.bookingCarDetailFormGroup.controls['emp_list'].patchValue(this.detailDatasource);
        this.bookingCarDetailFormGroup.controls['user_id'].setValue(this.token);
        this.bookingcarService.ApiBookCarSubmit(this.bookingCarDetailFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('detailDatasource-local');
              this.localstorageService.removeItem('searchDatasource-local');
              this.bookingCarId = data.value;
              this.getDetail();
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
        this.bookingCarDetailFormGroup.controls['id'].setValue(this.bookingCarId ?? '');
        this.bookingCarDetailFormGroup.controls['emp_list'].patchValue(this.detailDatasource);
        this.bookingcarService.ApiBookCarSubmit(this.bookingCarDetailFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('detailDatasource-local');
              this.localstorageService.removeItem('searchDatasource-local');
              this.getDetail();
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

  saveSend() {
    if (this.getFormValidationErrors()) {
      this.spinner.show();
      let bookingStartDate = '';
      let bookingStopDate = '';
      if ((typeof this.bookingCarDetailFormGroup.controls['start_date'].value === 'string')
        && (this.bookingCarDetailFormGroup.controls['start_date'].value.indexOf('/') > -1)) {
        const str = this.bookingCarDetailFormGroup.controls['start_date'].value.split('/');
        let year = Number(str[2]);
        const month = Number(str[1]) - 1;
        const date = Number(str[0]);
        let newStartDate = new Date(year, month, date);
        bookingStartDate = this.datepipe.transform(newStartDate, 'dd/MM/yyyy');
      } else {
        bookingStartDate = this.datepipe.transform(this.bookingCarDetailFormGroup.controls['start_date'].value, 'dd/MM/yyyy');
      }
      this.bookingCarDetailFormGroup.controls['start_date'].patchValue(bookingStartDate);

      if ((typeof this.bookingCarDetailFormGroup.controls['stop_date'].value === 'string')
        && (this.bookingCarDetailFormGroup.controls['stop_date'].value.indexOf('/') > -1)) {
        const str = this.bookingCarDetailFormGroup.controls['stop_date'].value.split('/');
        let year = Number(str[2]);
        const month = Number(str[1]) - 1;
        const date = Number(str[0]);
        let newStopDate = new Date(year, month, date);
        bookingStopDate = this.datepipe.transform(newStopDate, 'dd/MM/yyyy');
      } else {
        bookingStopDate = this.datepipe.transform(this.bookingCarDetailFormGroup.controls['stop_date'].value, 'dd/MM/yyyy');
      }
      this.bookingCarDetailFormGroup.controls['stop_date'].patchValue(bookingStopDate);

      this.bookingCarDetailFormGroup.controls['method'].setValue('save_send');
      if (this.bookingCarDetailFormGroup.controls['id'].value == '0' || this.bookingCarDetailFormGroup.controls['id'].value == '') {
        this.bookingCarDetailFormGroup.controls['id'].setValue(this.bookingCarId ?? '');
        this.bookingCarDetailFormGroup.controls['emp_list'].patchValue(this.detailDatasource);
        this.bookingCarDetailFormGroup.controls['user_id'].setValue(this.token);
        this.bookingCarDetailFormGroup.controls['bc_request'].setValue(this.personRequestCode);
        this.bookingcarService.ApiBookCarSubmit(this.bookingCarDetailFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('detailDatasource-local');
              this.localstorageService.removeItem('searchDatasource-local');
              this.bookingCarId = data.value;
              if (this.isEmployeeSh == true) {
                this.saveApprove();
              } else {
                this.getDetail();
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
        this.bookingCarDetailFormGroup.controls['id'].setValue(this.bookingCarId ?? '');
        this.bookingCarDetailFormGroup.controls['emp_list'].patchValue(this.detailDatasource);
        this.bookingCarDetailFormGroup.controls['user_id'].setValue(this.token);
        this.bookingCarDetailFormGroup.controls['bc_request'].setValue(this.personRequestCode);
        this.bookingcarService.ApiBookCarSubmit(this.bookingCarDetailFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('detailDatasource-local');
              this.localstorageService.removeItem('searchDatasource-local');
              this.getDetail();
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

  carTypeChange(event) {
    this.numbers = [];
    this.getDataByCarType(event.value, this.numbers);
  }
  private getDataByCarType(carType, cars) {
    const bookingCarDeatilForm = new BookingCarDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      bookingCarDeatilForm.bookingCarDetailFormBuilder
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

  getFormValidationErrors() {
    let valid = true;
    Object.keys(this.bookingCarDetailFormGroup.controls).forEach(key => {
      this.bookingCarDetailFormGroup.controls[key].markAsDirty();
      this.bookingCarDetailFormGroup.controls[key].markAsTouched();
      this.bookingCarDetailFormGroup.controls[key].markAsPending();
      const controlErrors: ValidationErrors = this.bookingCarDetailFormGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
        valid = false;
      }
    });
    if (this.bookingCarDetailFormGroup.controls['car_type_id'].value == null) {
      this.carTypeIdErrors = true;
    }
    if (this.bookingCarDetailFormGroup.controls['car_id'].value == null) {
      this.carIdErrors = true;
    }
    if (this.bookingCarDetailFormGroup.controls['reason_id'].value == null) {
      this.reasonIdErrors = true;
    }
    if (this.bookingCarDetailFormGroup.controls['dest_id'].value == null) {
      this.destIdErrors = true;
    }
    if (this.bookingCarDetailFormGroup.controls['start_time'].value != '') {
      let start_time = this.bookingCarDetailFormGroup.controls['start_time'].value;
      let timeFrom = Number(start_time.substring(0, 2));
      let stop_time = this.bookingCarDetailFormGroup.controls['stop_time'].value;
      let timeTo = Number(stop_time.substring(0, 2));
      if (timeFrom > timeTo) {
        this.alertService.warning('เวลา ไม่ถูกต้อง');
        valid = false;
      }
    }
    return valid;
  }

  searchId(dataKey) {
    this.localstorageService.removeItem('detailDatasource-local');
    const bookingRoomDeatilForm = new BookingCarDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      bookingRoomDeatilForm.bookingCarDetailFormBuilder
    );
    if (dataKey != '') {
      this.itemFormGroup.controls['method'].setValue('search_by_id');
      this.itemFormGroup.controls['emp_code'].setValue(dataKey);
      this.itemFormGroup.controls['user_id'].setValue(this.token);
      this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
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
            });
          }
          this.spinner.hide();
        }, (err) => {
          this.spinner.hide();
          this.alertService.error(err);
        });
    }
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

  serachDataPerson() {
    this.localstorageService.removeItem('searchDatasource-local');
    this.spinner.show();
    const bookingCarSearchForm = new BookingCarSearchForm();
    this.searchFormGroup = this.formBuilder.group(
      bookingCarSearchForm.bookingCarSearchFormBuilder
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

  addPerson(type) {
    this.personType = type;
    this.localstorageService.removeItem('searchDatasource-local');
    this.searchDatasource = [];
    this.searchEmpCode = '';
    this.searchFullName = '';
    this.searchSession = null;
    this.searchSelecteds = [];
    this.modalAddPerson = true;
  }

  deleteDetailDatasource(empCode) {
    this.localstorageService.removeItem('detailDatasource-local');
    let detailDatasourceNew = [];
    this.detailDatasource.forEach(element => {
      if (empCode != element.emp_code) {
        detailDatasourceNew.push({
          emp_code: element.emp_code,
          emp_name: element.emp_name,
          depart: element.depart,
          emp_tel: element.tel,
          emp_email: element.email,
        });
      }
    });
    this.detailDatasource = [];
    this.detailDatasource = detailDatasourceNew;
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
    let stopDate = this.bookingCarDetailFormGroup.controls['stop_date'].value;
    let dateTo = new Date(stopDate);
    if (dateFrom > dateTo) {
      this.bookingCarDetailFormGroup.controls['stop_date'].setValue(dateFrom);
    }
  }

}
