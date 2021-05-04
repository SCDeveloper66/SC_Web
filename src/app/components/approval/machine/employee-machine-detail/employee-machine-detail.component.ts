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

@Component({
  selector: 'app-employee-machine-detail',
  templateUrl: './employee-machine-detail.component.html',
  styleUrls: ['./employee-machine-detail.component.scss']
})
export class EmployeeMachineDetailComponent implements OnInit {
  token;
  currentUser: any;
  empMachineId;
  items: any[];
  items2: any[];
  activeIndex: number = 0;
  empDetailFormGroup: FormGroup;
  btnSubmit: boolean = false;
  btnApprove: boolean = false;
  machines: SelectItem[] = [];
  machine;
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
    // this.spinner.show();
    const empDeatilForm = new MachineForm();
    this.empDetailFormGroup = this.formBuilder.group(
      empDeatilForm.machineFormBuilder
    );
    this.empListDatasource = [];
    this.empOtherListDatasource = [];
    // this.getDetail();
    this.items = [
      { label: 'Submit' },
      { label: 'Waiting Approve' },
      { label: 'Approve' }
    ];
    this.activeIndex = 0;
    this.machines = [
      { value: 'machine1', label: 'เครื่องจักร1' },
      { value: 'machine2', label: 'เครื่องจักร2' },
      { value: 'machine3', label: 'เครื่องจักร3' }
    ];
    this.searchcols = [
      { field: 'depart' },
      { field: 'emp_name' },
      { field: 'emp_tel' },
      { field: 'emp_email' },
    ];
    this.empListcols = [
      { field: 'depart' },
      { field: 'emp_name' },
      { field: 'tel' },
      { field: 'status' },
      { field: 'remark' },
    ];
    this.empOtherListcols = [
      { field: 'depart' },
      { field: 'emp_name' },
      { field: 'tel' },
      { field: 'status' },
      { field: 'remark' },
    ];
    this.btnSubmit = true;
  }

  // private getDetail() {
  //   const id = this.route.snapshot.paramMap.get('id');
  //   if (id) {
  //     this.empLeaveId = id;
  //   }
  //   this.empLeaveDetailFormGroup.controls['method'].setValue('leave-detail');
  //   this.empLeaveDetailFormGroup.controls['id'].setValue(
  //     this.empLeaveId ?? ''
  //   );
  //   this.empLeaveDetailFormGroup.controls['user_id'].setValue(this.token);
  //   this.approvalService
  //     .ApiApproval(this.empLeaveDetailFormGroup.getRawValue())
  //     .subscribe(
  //       (data) => {
  //         this.items = [];
  //         if (data) {
  //           const strStart = data.leave_start.split('/');
  //           let yearStrat = Number(strStart[2]);
  //           const monthStrat = Number(strStart[1]) - 1;
  //           const dateStrat = Number(strStart[0]);
  //           let newStartDate = new Date(yearStrat, monthStrat, dateStrat);

  //           const strStop = data.leave_stop.split('/');
  //           let yearStop = Number(strStop[2]);
  //           const monthStop = Number(strStop[1]) - 1;
  //           const dateStop = Number(strStop[0]);
  //           let newStopDate = new Date(yearStop, monthStop, dateStop);

  //           this.empDetailFormGroup.controls['emp_code'].patchValue(
  //             data.emp_code
  //           );
  //           this.empDetailFormGroup.controls['emp_name'].patchValue(
  //             data.emp_name
  //           );
  //           this.empDetailFormGroup.controls['machineCode'].patchValue(
  //             data.machineCode
  //           );
  //           this.empDetailFormGroup.controls['leaveStart'].patchValue(
  //             newStartDate
  //           );
  //           this.empDetailFormGroup.controls['leaveStop'].patchValue(
  //             newStopDate
  //           );
  //           this.empDetailFormGroup.controls['remark'].patchValue(
  //             data.remark
  //           );
  //           this.items.push({ label: 'Submit' });
  //           if (data.leave_over == 'N') {
  //             this.items.push({ label: 'Waiting Approve' });
  //             this.items.push({ label: 'Approve' });
  //             if (data.sts_text == 'Submit') {
  //               this.activeIndex = 1;
  //               this.btnApprove = true;
  //             } else if (data.sts_text == 'Approve') {
  //               this.activeIndex = 2;
  //             } else {
  //               this.activeIndex = 0;
  //             }
  //           } else {
  //             this.items.push({ label: 'Waiting Approval1' });
  //             this.items.push({ label: 'Waiting Approval2' });
  //             this.items.push({ label: 'Approve' });
  //             if (data.sts_text == 'Submit') {
  //               this.activeIndex = 1;
  //               this.btnApprove = true;
  //             } else if (data.sts_text == 'Approval1') {
  //               this.activeIndex = 2;
  //               this.btnApprove = true;
  //             } else if (data.sts_text == 'Approval2') {
  //               this.activeIndex = 3;
  //             } else {
  //               this.activeIndex = 0;
  //             }
  //           }
  //         }
  //         this.spinner.hide();
  //       },
  //       (err) => {
  //         this.spinner.hide();
  //         this.alertService.error(err);
  //       }
  //     );
  // }
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
    this.employeeService.ApiEmployee(this.searchEmpFormGroup.getRawValue()).subscribe(
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

  saveAddPerson() {
    debugger;
    this.modalAddPerson = false;
    this.localstorageService.removeItem('empListDatasource-local');
    this.localstorageService.removeItem('empOtherListDatasource-local');
    if (this.personType == 'emp') {
      this.searchDatasource.forEach(element => {
        if (this.searchSelecteds.some((a) => a == element.emp_code)) {
          const result = this.empListDatasource.find(({ emp_code }) => emp_code === element.emp_code);
          if (result === undefined) {
            this.empListDatasource.push({
              emp_code: element.emp_code,
              emp_name: element.emp_code + ' ' + element.emp_name,
              depart: element.depart ?? '-',
              tel: element.emp_tel ?? '-',
            });
          }
        }
      });
    } else {
      this.searchDatasource.forEach(element => {
        if (this.searchSelecteds.some((a) => a == element.emp_code)) {
          const result = this.empOtherListDatasource.find(({ emp_code }) => emp_code === element.emp_code);
          if (result === undefined) {
            this.empOtherListDatasource.push({
              emp_code: element.emp_code,
              emp_name: element.emp_code + ' ' + element.emp_name,
              depart: element.depart ?? '-',
              tel: element.emp_tel ?? '-',
            });
          }
        }
      });
    }
  }

  checkForDuplicates(array, keyName) {
    return new Set(array.map(item => item[keyName])).size !== array.length
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
    this.employeeService.ApiEmployee(this.searchEmpFormGroup.getRawValue()).subscribe(
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

  deleteDetailDatasource(empCode, type) {
    this.localstorageService.removeItem('empListDatasource-local');
    this.localstorageService.removeItem('empOtherListDatasource-local');
    if (type == 'emp') {
      let newEmpListDatasource = this.empListDatasource.filter(element => element.emp_code != empCode);
      this.empListDatasource = [];
      this.empListDatasource = newEmpListDatasource;
    } else {
      let newEmpOtherListDatasource = this.empOtherListDatasource.filter(element => element.emp_code != empCode)
      this.empOtherListDatasource = [];
      this.empOtherListDatasource = newEmpOtherListDatasource;
    }
  }


}
