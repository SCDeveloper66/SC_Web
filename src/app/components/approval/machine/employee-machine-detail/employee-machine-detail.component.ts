import { element } from 'protractor';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SelectItem } from 'primeng';
import { BookingRoomDetailForm } from 'src/app/components/meetingroom/booking-room/booking-room-detail/booking-room-detail.form';
import { BookingRoomSearchForm } from 'src/app/components/meetingroom/booking-room/booking-room-detail/booking-room-search.form';
import { ApprovalService } from 'src/app/services/approval/approval.service';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { MachineForm } from '../machine.form';
import { EmployeeListForm } from 'src/app/components/employee/employee-list/employee-list.form';

@Component({
  selector: 'app-employee-machine-detail',
  templateUrl: './employee-machine-detail.component.html',
  styleUrls: ['./employee-machine-detail.component.scss'],
})
export class EmployeeMachineDetailComponent implements OnInit {
  token;
  currentUser: any;
  jobId;
  items: any[];
  items2: any[];
  activeIndex: number = 0;
  empDetailFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  machines: SelectItem[] = [];
  jobshifts: SelectItem[] = [];
  machine;
  minDate: Date;
  personType;
  modalAddPerson: boolean = false;
  searchEmpCode;
  searchFullName;
  searchSession;
  searchSessions: SelectItem[] = [];
  searchcols: any[];
  searchDatasource: any[];
  searchSelecteds: string[];
  searchEmpFormGroup: FormGroup;
  empListcols: any[];
  empOtherListcols: any[];
  empListDatasource: any[];
  empOtherListDatasource: any[];
  empOtherListSelecteds: any[];

  add_emp_1: boolean = false;
  add_emp_2: boolean = false;
  approve: boolean = false;
  approve_2: boolean = false;
  cancel: boolean = false;
  reject: boolean = false;
  reject_2: boolean = false;
  save: boolean = false;
  send_approve: boolean = false;
  send_depart_b: boolean = false;
  groupDetail: boolean = false;
  groupEmp_1: boolean = false;
  groupEmp_2: boolean = false;
  step1_status = '0';
  step2_status = '0';
  step3_status = '0';
  step4_status = '0';

  modalConfirm: boolean = false;
  submitRemark;
  submitStatus;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private approvalService: ApprovalService,
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
      const token = JSON.parse(
        this.localstorageService.getLocalStorage('tokenStandardCan')
      );
      this.token = token;
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }
  }

  ngOnInit(): void {
    this.localstorageService.removeItem('empListDatasource-local');
    this.localstorageService.removeItem('empOtherListDatasource-local');
    this.localstorageService.removeItem('searchDatasource-local');
    this.spinner.show();
    const empDeatilForm = new MachineForm();
    this.empDetailFormGroup = this.formBuilder.group(
      empDeatilForm.machineFormBuilder
    );
    this.empListDatasource = [];
    this.empOtherListDatasource = [];
    this.getMasterDDL();
    this.getDetail();
    this.activeIndex = 0;
    this.searchcols = [
      { field: 'depart' },
      { field: 'emp_name' },
      { field: 'emp_tel' },
      { field: 'emp_email' },
    ];
    this.empListcols = [
      { field: 'no' },
      { field: 'depart_name' },
      { field: 'emp_name' },
      { field: 'emp_tel' },
      { field: 'appr_status' },
      { field: 'appr_remark' },
      { field: 'accept_status' },
      { field: 'accept_remark' },
      { field: 'emp_code' },
    ];
    this.empOtherListcols = [
      { field: 'no' },
      { field: 'depart_name' },
      { field: 'emp_name' },
      { field: 'emp_tel' },
      { field: 'appr_status' },
      { field: 'appr_remark' },
      { field: 'accept_status' },
      { field: 'accept_remark' },
      { field: 'emp_code' },
      { field: 'show_checkbox' },
    ];
  }

  private getMasterDDL() {
    const itemForm = new MachineForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.machineFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.approvalService
      .ApiMachineApproval(this.itemFormGroup.getRawValue())
      .subscribe(
        (data) => {
          if (data) {
            this.machines = [];
            this.jobshifts = [];
            if (data.machine) {
              data.machine.forEach((m) => {
                this.machines.push({ value: m.code, label: m.text });
              });
            }
            if (data.shift) {
              data.shift.forEach((m) => {
                this.jobshifts.push({ value: m.code, label: m.text });
              });
            }
          }
        },
        (err) => {
          this.alertService.error(err);
        }
      );
  }

  private getDetail() {
    const empDeatilForm = new MachineForm();
    this.empDetailFormGroup = this.formBuilder.group(
      empDeatilForm.machineFormBuilder
    );
    this.empDetailFormGroup.controls['method'].setValue('detail');
    this.empDetailFormGroup.controls['user_id'].setValue(this.token);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobId = id;
    }
    this.empDetailFormGroup.controls['job_id'].setValue(this.jobId);
    this.approvalService
      .ApiMachineApproval(this.empDetailFormGroup.getRawValue())
      .subscribe(
        (data) => {
          this.items = [];
          if (data) {
            if (data.button) {
              this.add_emp_1 = data.button.add_emp_1;
              this.add_emp_2 = data.button.add_emp_2
              this.approve = data.button.approve;
              this.approve_2 = data.button.approve_2;
              this.cancel = data.button.cancel;
              this.reject = data.button.reject;
              this.reject_2 = data.button.reject_2;
              this.save = data.button.save;
              this.send_approve = data.button.send_approve;
              this.send_depart_b = data.button.send_depart_b;
            }
            if (data.group) {
              this.groupDetail = data.group.detail;
              this.groupEmp_1 = data.group.emp_1;
              this.groupEmp_2 = data.group.emp_2;
            }
            if (data.detail_emp_1) {
              this.empListDatasource = [];
              data.detail_emp_1.forEach((element) => {
                this.empListDatasource.push({
                  no: element.no,
                  depart_name: element.depart_name,
                  emp_name: element.emp_name,
                  emp_tel: element.emp_tel,
                  appr_status: element.appr_status,
                  appr_remark: element.appr_remark,
                  accept_status: element.accept_status,
                  accept_remark: element.accept_remark,
                  emp_code: element.emp_code,
                });
              });
            }
            if (data.detail_emp_2) {
              this.empOtherListDatasource = [];
              data.detail_emp_2.forEach((element) => {
                this.empOtherListDatasource.push({
                  no: element.no,
                  show_checkbox: element.show_checkbox,
                  depart_name: element.depart_name,
                  emp_name: element.emp_name,
                  emp_tel: element.emp_tel,
                  appr_status: element.appr_status,
                  appr_remark: element.appr_remark,
                  accept_status: element.accept_status,
                  accept_remark: element.accept_remark,
                  emp_code: element.emp_code,
                  check_sts: '0',
                });
              });
            }
            if (data.detail) {
              if (data.detail.step1_lable != '' && data.detail.step1_lable != null) {
                this.items.push({ label: data.detail.step1_lable });
              }
              if (data.detail.step2_lable != '' && data.detail.step2_lable != null) {
                this.items.push({ label: data.detail.step2_lable });
              }
              if (data.detail.step3_lable != '' && data.detail.step3_lable != null) {
                this.items.push({ label: data.detail.step3_lable });
              }
              if (data.detail.step4_lable != '' && data.detail.step4_lable != null) {
                this.items.push({ label: data.detail.step4_lable });
              }
              if (data.detail.step1_status == '1') {
                this.activeIndex = 0;
                this.step1_status = '1';
              }
              else if (data.detail.step2_status == '1') {
                this.activeIndex = 1;
                this.step2_status = '1';
              }
              else if (data.detail.step3_status == '1') {
                this.activeIndex = 2;
                this.step3_status = '1';
              }
              else if (data.detail.step4_status == '1') {
                this.activeIndex = 3;
                this.step4_status = '1';
              }
              this.jobId = data.detail.job_id
              this.empDetailFormGroup.controls['job_name'].patchValue(data.detail.job_name);
              this.empDetailFormGroup.controls['machine_id'].patchValue(data.detail.machine_id);
              this.empDetailFormGroup.controls['shift_id'].patchValue(data.detail.shift_id);
              this.empDetailFormGroup.controls['job_desc'].patchValue(data.detail.job_desc);
              this.empDetailFormGroup.controls['from_date'].patchValue(data.detail.date_start);
              this.empDetailFormGroup.controls['to_date'].patchValue(data.detail.date_stop);
            }
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          this.alertService.error(err);
        }
      );
  }

  get f() {
    return this.empDetailFormGroup.controls;
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

  private getMasterDDl() {
    const bookingRoomDeatilForm = new BookingRoomDetailForm();
    this.searchEmpFormGroup = this.formBuilder.group(
      bookingRoomDeatilForm.bookingRoomDetailFormBuilder
    );
    this.searchEmpFormGroup.controls['method'].setValue('master');
    this.searchEmpFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService
      .ApiEmployee(this.searchEmpFormGroup.getRawValue())
      .subscribe(
        (data) => {
          if (data) {
            this.searchSessions = [];
            data.depart.forEach((m) => {
              this.searchSessions.push({ value: m.value, label: m.text });
            });
          }
        },
        (err) => {
          this.alertService.error(err);
        }
      );
  }

  saveAddPerson() {
    this.modalAddPerson = false;
    this.localstorageService.removeItem('empListDatasource-local');
    this.localstorageService.removeItem('empOtherListDatasource-local');
    if (this.personType == 'emp') {
      this.searchDatasource.forEach((element) => {
        if (this.searchSelecteds.some((a) => a == element.emp_code)) {
          const result = this.empListDatasource.find(
            ({ emp_code }) => emp_code === element.emp_code
          );
          if (result === undefined) {
            this.empListDatasource.push({
              emp_code: element.emp_code,
              emp_name: element.emp_code + ' ' + element.emp_name,
              depart_name: element.depart ?? '-',
              emp_tel: element.emp_tel ?? '-',
              appr_status: '',
            });
          }
        }
      });
    } else {
      this.searchDatasource.forEach((element) => {
        if (this.searchSelecteds.some((a) => a == element.emp_code)) {
          const result = this.empOtherListDatasource.find(
            ({ emp_code }) => emp_code === element.emp_code
          );
          if (result === undefined) {
            this.empOtherListDatasource.push({
              show_checkbox: '0',
              check_sts: '0',
              appr_status: '',
              emp_code: element.emp_code,
              emp_name: element.emp_code + ' ' + element.emp_name,
              depart_name: element.depart ?? '-',
              emp_tel: element.emp_tel ?? '-',
            });
          }
        }
      });
    }
  }

  checkForDuplicates(array, keyName) {
    return new Set(array.map((item) => item[keyName])).size !== array.length;
  }

  serachDataPerson() {
    this.localstorageService.removeItem('searchDatasource-local');
    this.spinner.show();
    const bookingRoomSearchForm = new BookingRoomSearchForm();
    this.searchEmpFormGroup = this.formBuilder.group(
      bookingRoomSearchForm.bookingRoomSearchFormBuilder
    );
    this.searchEmpFormGroup.controls['method'].setValue('search_by_popup');
    this.searchEmpFormGroup.controls['emp_code'].setValue(this.searchEmpCode);
    this.searchEmpFormGroup.controls['emp_name'].setValue(this.searchFullName);
    this.searchEmpFormGroup.controls['sh_id'].setValue(this.searchSession);
    this.searchEmpFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService
      .ApiEmployee(this.searchEmpFormGroup.getRawValue())
      .subscribe(
        (data) => {
          if (data) {
            this.searchDatasource = [];
            data.forEach((element) => {
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
        },
        (err) => {
          this.alertService.error(err);
        }
      );
  }

  deleteDetailDatasource(empCode, type) {
    this.localstorageService.removeItem('empListDatasource-local');
    this.localstorageService.removeItem('empOtherListDatasource-local');
    if (type == 'emp') {
      let newEmpListDatasource = this.empListDatasource.filter(
        (element) => element.emp_code != empCode
      );
      this.empListDatasource = [];
      this.empListDatasource = newEmpListDatasource;
    } else {
      let newEmpOtherListDatasource = this.empOtherListDatasource.filter(
        (element) => element.emp_code != empCode
      );
      this.empOtherListDatasource = [];
      this.empOtherListDatasource = newEmpOtherListDatasource;
    }
  }

  funcSelectDateFrom(event) {
    let dateFrom = new Date(event);
    let month = dateFrom.getMonth() + 1;
    let year = dateFrom.getFullYear();
    let prevMonth = month === 0 ? 12 : month - 1;
    let prevYear = prevMonth === 12 ? year - 1 : year;
    this.minDate = new Date(event);
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(prevYear);
    let stopDate = this.empDetailFormGroup.controls['to_date'].value;
    let dateTo = new Date(stopDate);
    if (dateFrom > dateTo) {
      this.empDetailFormGroup.controls['to_date'].setValue(dateFrom);
    }
  }

  openRemarkEmpMachine(status) {
    this.submitRemark = '';
    this.modalConfirm = true;
    this.submitStatus = status;
  }

  closeRemarkEmpMachine() {
    this.submitRemark = '';
    this.modalConfirm = false;
    this.submitStatus = '';
  }

  saveEmpMachine(status) {
    this.spinner.show();
    // this.modalConfirm = false;
    this.empDetailFormGroup.controls['method'].setValue('submit');
    this.empDetailFormGroup.controls['job_id'].setValue(this.jobId);
    this.empDetailFormGroup.controls['submit_type'].setValue(this.submitStatus ?? status);
    this.empDetailFormGroup.controls['submit_remark'].setValue(this.submitRemark ?? '');
    let detail_emp_1 = [];
    this.empListDatasource.forEach((element) => {
      detail_emp_1.push({
        check_sts: '0',
        emp_code: element.emp_code,
      });
    });
    this.empDetailFormGroup.controls['detail_emp_1'].setValue(detail_emp_1);
    let detail_emp_2 = [];
    this.empOtherListDatasource.forEach((element) => {
      let check_sts = '0';
      if (status == '7' || status == '8') {
        const result = this.empOtherListSelecteds.find(
          ({ emp_code }) => emp_code === element.emp_code
        );
        if (result === undefined) {
          check_sts = '0';
        } else {
          check_sts = '1';
        }
      }
      detail_emp_2.push({
        check_sts: check_sts,
        emp_code: element.emp_code,
      });
    });
    this.empDetailFormGroup.controls['detail_emp_2'].setValue(detail_emp_2);
    let bookingStartDate = '';
    let bookingStopDate = '';
    if ((typeof this.empDetailFormGroup.controls['from_date'].value === 'string')
      && (this.empDetailFormGroup.controls['from_date'].value.indexOf('/') > -1)) {
      const str = this.empDetailFormGroup.controls['from_date'].value.split('/');
      let year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      let newStartDate = new Date(year, month, date);
      bookingStartDate = this.datepipe.transform(newStartDate, 'dd/MM/yyyy');
    } else {
      bookingStartDate = this.datepipe.transform(this.empDetailFormGroup.controls['from_date'].value, 'dd/MM/yyyy');
    }
    this.empDetailFormGroup.controls['date_start'].patchValue(bookingStartDate);

    if ((typeof this.empDetailFormGroup.controls['to_date'].value === 'string')
      && (this.empDetailFormGroup.controls['to_date'].value.indexOf('/') > -1)) {
      const str = this.empDetailFormGroup.controls['to_date'].value.split('/');
      let year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      let newStopDate = new Date(year, month, date);
      bookingStopDate = this.datepipe.transform(newStopDate, 'dd/MM/yyyy');
    } else {
      bookingStopDate = this.datepipe.transform(this.empDetailFormGroup.controls['to_date'].value, 'dd/MM/yyyy');
    }
    this.empDetailFormGroup.controls['date_stop'].patchValue(bookingStopDate);
    this.empDetailFormGroup.controls['user_id'].setValue(this.token);
    this.approvalService
      .ApiMachineApproval(this.empDetailFormGroup.getRawValue())
      .subscribe(
        (data) => {
          if (data.status == 'S') {
            this.alertService.success('success');
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
