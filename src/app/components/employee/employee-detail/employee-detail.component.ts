import { Component, OnInit } from '@angular/core';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeDetailForm } from './employee-detail.form';
import { Table } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { EmployeeCardForm } from './employee-card.form';
import { SelectItem } from 'primeng/api';
import { EmployeeGradeForm } from './employee-grade.form';
import { EmployeeBehaviorForm } from './employee-behavior.form';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { BookingcarService } from 'src/app/services/bookingcar/bookingcar.service';
import { UserGroupForm } from '../../setting/user-role/user-group.form';
import { UserRoleService } from 'src/app/services/user-role/user-role.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  token;
  currentUser: any;
  profileTab: any;
  inouttab: any;
  leavetab: any;
  notetab: any;
  empCode;
  itemFormGroup: FormGroup;

  // inout
  inoutDateFrom: Date;
  inoutDateTo: Date;
  inoutNormal = 0;
  inoutAbsence = 0;
  inoutLate = 0;
  inoutcols: any[];
  inoutDatasource: any[];
  inoutminDate: Date;

  //OT
  OTDateFrom: Date;
  OTDateTo: Date;
  OTminDate: Date;
  OTData: any[];
  OTDatasource: any[];
  OTcols: any[];
  OTQuota: string = '00:00';
  OTUse: string = '00:00';
  OTShowDetail: Boolean = false;
  OTtab: any;

  // leave
  leaveDateFrom: Date;
  leaveDateTo: Date;
  leaveDatasource: any[];
  leavecols: any[];
  txtNote;
  leaveminDate: Date;

  // card
  cardDatasource: any[];
  cardcols: any[];
  public displayCardModal = false;
  cardId;
  carditemFormGroup: FormGroup;
  cardsSave: SelectItem[] = [];

  // grade
  gradeDatasource: any[];
  gradecols: any[];
  public displayGradeModal = false;
  gradeId;
  gradeitemFormGroup: FormGroup;
  gradesSave: SelectItem[] = [];
  public modalConfirmDelete = false;

  // behavior
  behaviorDatasource: any[];
  behaviorcols: any[];
  public displayBehaviorModal = false;
  behaviorId;
  behavioritemFormGroup: FormGroup;
  activitylist: SelectItem[] = [];
  public modalConfirmDeleteBehavior = false;
  public behaviorDetailErrors = false;

  //Role
  userGroup;
  userGroups: SelectItem[] = [];

  imageItem;
  fileBase64;

  isMobile: boolean = false;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private bookingcarService: BookingcarService,
    public datepipe: DatePipe,
    private userRoleService: UserRoleService,
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

    this.localstorageService.removeItem('inoutDatasource-local');
    this.localstorageService.removeItem('OTDatasource-local');
    this.localstorageService.removeItem('leaveDatasource-local');
    this.localstorageService.removeItem('cardDatasource-local');
    this.localstorageService.removeItem('gradeDatasource-local');
    this.localstorageService.removeItem('behaviorDatasource-local');
  }

  ngOnInit(): void {
    const cardForm = new EmployeeCardForm();
    this.carditemFormGroup = this.formBuilder.group(
      cardForm.employeeCardFormBuilder
    );
    const gradeForm = new EmployeeGradeForm();
    this.gradeitemFormGroup = this.formBuilder.group(
      gradeForm.employeeGradeFormBuilder
    );
    const behaviorForm = new EmployeeBehaviorForm();
    this.behavioritemFormGroup = this.formBuilder.group(
      behaviorForm.employeeBehaviorFormBuilder
    );
    this.inoutDatasource = [];
    this.inoutDateFrom = new Date();
    this.inoutDateTo = new Date();
    this.funcSelectDateFrom(this.inoutDateFrom, 'inout');
    this.leaveDateFrom = new Date();
    this.leaveDateTo = new Date();
    this.funcSelectDateFrom(this.leaveDateFrom, 'leave');
    this.OTDateFrom = new Date();
    this.OTDateTo = new Date();
    this.funcSelectDateFrom(this.OTDateFrom, 'OT');

    this.spinner.show();
    this.OTcols = [
      { field: 'ot_date', header: 'วันที่', sortable: true },
      { field: 'ot_detail', header: 'รายละเอียด', sortable: true },
      { field: 'ot_time', header: 'เวลา', sortable: true },
      { field: 'ot_hh_mm', header: 'ชั่วโมง : นาที', sortable: true }
    ];

    this.inoutcols = [
      { field: 'date', header: 'วันที่', sortable: true },
      { field: 'shift', header: 'กะงาน', sortable: true },
      { field: 'time_in', header: 'เวลาเข้างาน', sortable: true },
      { field: 'time_in_status', header: 'สถานะการเข้างาน', sortable: true },
      { field: 'time_out', header: 'เวลาออกงาน', sortable: true },
      { field: 'time_out_status', header: 'สถานะการออกงาน', sortable: true },
      { field: 'type', header: 'ประเภทการลงเวลา', sortable: true },
    ];
    this.leavecols = [
      { field: 'start_date', header: 'วันที่เริ่มต้น', sortable: true },
      { field: 'stop_date', header: 'วันที่สิ้นสุด', sortable: true },
      { field: 'total_day', header: 'จำนวนวัน', sortable: true },
      { field: 'type', header: 'ประเภทการลา', sortable: true },
      { field: 'reason', header: 'เหตุผลการลา', sortable: true },
      { field: 'create_date', header: 'วันที่ทำรายการ', sortable: true },
      { field: 'appr_status', header: 'สถานะการลา', sortable: true },
    ];
    this.behaviorcols = [
      { field: 'no', header: 'ลำดับ', sortable: true, width: "70px" },
      { field: 'year', header: 'ปี', sortable: true },
      { field: 'date', header: 'วันที่', sortable: true },
      { field: 'detail', header: 'รายละเอียด', sortable: true },
      { field: 'detail_id', header: 'รายละเอียด', sortable: true },
      { field: 'score', header: 'คะแนน', sortable: true },
      { field: 'action', header: 'Action', sortable: true },
    ];
    this.gradecols = [
      { field: 'no', header: 'ลำดับ', sortable: true, width: "70px" },
      { field: 'no2', header: 'ครั้งที่', sortable: true },
      { field: 'date', header: 'วันที่มีผล', sortable: true },
      { field: 'grade', header: 'เกรด', sortable: true },
      { field: 'action', header: 'Action', sortable: true },
    ];
    this.cardcols = [
      { field: 'no', header: 'ลำดับ', sortable: true, width: "70px" },
      { field: 'date', header: 'วันที่', sortable: true },
      { field: 'card_no', header: 'รหัสบัตร', sortable: true },
      { field: 'status', header: 'สถานะ', sortable: true },
      { field: 'action', header: 'Action', sortable: true },
    ];
    this.cardsSave = [
      { label: 'ระงับใช้งาน', value: '0' },
      { label: 'ใช้งาน', value: '1' }
    ];
    this.gradesSave = [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
      { label: 'D', value: 'D' }
    ];

    this.getMasterDDL();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.empCode = id;
      this.getProfileTab();
      this.getInoutTab();
      this.getOTTab();
      this.getHeadLeaveTab();
      this.getBehaviorTab();
      this.getGradeTab();
      this.getCardTab();
      this.getNoteTab();
      this.getRoleTab();
    } else {
      this.spinner.hide();
      this.router.navigate(['/pagenotfound']);
    }
  }

  private getMasterDDL() {
    const itemForm = new EmployeeDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeDetailFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('search');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.itemFormGroup.controls['name'].setValue("");
    this.bookingcarService.ApiMasActivity(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {

        if (data) {
          console.log("load ddl");
          console.log(data);
          this.activitylist = [];
          // this.activitylist.push({ value: '-1', label: 'ทั้งหมด' });
          if (data) {
            data.forEach(m => {
              this.activitylist.push({ value: m.id.toString(), label: m.name });
            });
          }

        }
      }, (err) => {
        this.alertService.error(err);
      });
  }

  private getProfileTab() {
    this.profileTab = null;
    const itemForm = new EmployeeDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeDetailFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('tab_profile_search');
    this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          debugger;
          this.profileTab = data[0];
          this.userGroup = data[0].emp_group;
          const itemFormImg = new EmployeeDetailForm();
          this.itemFormGroup = this.formBuilder.group(
            itemFormImg.employeeDetailFormBuilder
          );
          this.itemFormGroup.controls['method'].setValue('get_upload_file');
          this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
          this.itemFormGroup.controls['user_id'].setValue(this.token);
          this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
            (sub) => {
              if (sub.status == 'S') {
                this.imageItem = sub.value;
              } else {
                this.imageItem = null;
              }
            }, (subErr) => {
              this.alertService.error(subErr);
            });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  serachInout(dt: Table) {
    this.localstorageService.removeItem('inoutDatasource-local');
    this.getInoutTab();
  }

  serachOT(dt: Table) {
    this.localstorageService.removeItem('OTDatasource-local');
    this.getOTTab();
  }

  serachLeave(dt: Table) {
    this.localstorageService.removeItem('leaveDatasource-local');
    this.getDetailLeaveTab();
  }

  private getInoutTab() {
    this.spinner.show();
    this.inouttab = null;
    const itemForm = new EmployeeDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeDetailFormBuilder
    );
    let inoutDateFrom = this.inoutDateFrom == null ? '' : this.datepipe.transform(this.inoutDateFrom, 'dd/MM/yyyy');
    let inoutDateTo = this.inoutDateTo == null ? '' : this.datepipe.transform(this.inoutDateTo, 'dd/MM/yyyy');
    this.itemFormGroup.controls['method'].setValue('tab_inout_search');
    this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.itemFormGroup.controls['start_date'].setValue(inoutDateFrom);
    this.itemFormGroup.controls['stop_date'].setValue(inoutDateTo);
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        this.inoutDatasource = [];
        if (data) {
          this.inouttab = data;
          this.inoutNormal = data.status1 ?? 0;
          this.inoutAbsence = data.status2 ?? 0;
          this.inoutLate = data.status3 ?? 0;
          data.data.forEach(element => {
            this.inoutDatasource.push({
              date: element.date,
              shift: element.shift,
              time_in: element.time_in,
              time_in_status: element.time_in_status,
              time_out: element.time_out,
              time_out_status: element.time_out_status,
              type: element.type,
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  private getOTTab() {
    this.spinner.show();
    this.inouttab = null;
    const itemForm = new EmployeeDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeDetailFormBuilder
    );
    let otDateFrom = this.OTDateFrom == null ? '' : this.datepipe.transform(this.OTDateFrom, 'dd/MM/yyyy');
    let otDateTo = this.OTDateTo == null ? '' : this.datepipe.transform(this.OTDateTo, 'dd/MM/yyyy');
    this.itemFormGroup.controls['method'].setValue('tab_ot_search');
    this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.itemFormGroup.controls['start_date'].setValue(otDateFrom);
    this.itemFormGroup.controls['stop_date'].setValue(otDateTo);
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        // alert(JSON.stringify(data));

        this.OTData = data;

        this.OTDatasource = [];
        if (data) {
          this.OTtab = data;
          this.OTQuota = data.quota ?? 0;
          this.OTUse = data.hours ?? 0;
          // this.inoutLate = data.status3 ?? 0;
          data.quota_list.forEach(element => {
            this.OTDatasource.push({
              ot_date: element.line1,
              // ot_time: element.shift,
              // ot_detail: element.time_in,
              ot_hh_mm: element.hours
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  OTTypeClicked(opt) {
    this.OTDatasource = [];
    if (opt == 1) {

      this.OTData["quota_list"].forEach(element => {
        this.OTDatasource.push({
          ot_date: element.line1,
          // ot_time: element.shift,
          // ot_detail: element.time_in,
          ot_hh_mm: element.hours
        });
      });

    } else {
      this.OTData["hours_list"].forEach(element => {
        this.OTDatasource.push({
          ot_date: element.line1,
          // ot_time: element.shift,
          // ot_detail: element.time_in,
          ot_hh_mm: element.hours
        });
      });
    }
  }

  private getHeadLeaveTab() {
    this.leavetab = null;
    const itemForm = new EmployeeDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeDetailFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('tab_leave_search');
    this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.leavetab = data;
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  private getDetailLeaveTab() {
    this.spinner.show();
    this.leavetab = null;
    const itemForm = new EmployeeDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeDetailFormBuilder
    );
    let leaveDateFrom = this.leaveDateFrom == null ? '' : this.datepipe.transform(this.leaveDateFrom, 'dd/MM/yyyy');
    let leaveDateTo = this.leaveDateTo == null ? '' : this.datepipe.transform(this.leaveDateTo, 'dd/MM/yyyy');
    this.itemFormGroup.controls['method'].setValue('tab_leave_search');
    this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.itemFormGroup.controls['start_date'].setValue(leaveDateFrom);
    this.itemFormGroup.controls['stop_date'].setValue(leaveDateTo);
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        this.leaveDatasource = [];
        if (data) {
          this.leavetab = data;
          this.leaveDatasource = data.data;
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  private getNoteTab() {
    this.spinner.show();
    this.notetab = null;
    this.txtNote = null;
    const itemForm = new EmployeeDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeDetailFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('tab_note_search');
    this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.notetab = data;
          this.txtNote = data.note;
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });

  }

  private getRoleTab() {
    const userGroupForm = new UserGroupForm();
    this.itemFormGroup = this.formBuilder.group(
      userGroupForm.UserGroupFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('get_usergroup');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.userRoleService.ApiUserRole(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        this.userGroups = [];
        if (data) {
          data.UserGroupList.forEach(m => {
            this.userGroups.push({ value: m.id.toString(), label: m.name });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.alertService.error(err);
        this.spinner.hide();
      });
  }

  saveNoteData() {
    this.spinner.show();
    const itemForm = new EmployeeDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeDetailFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('tab_note_update');
    this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.itemFormGroup.controls['note'].setValue(this.txtNote);
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data.status == 'S') {
          this.alertService.success('success');
        } else {
          this.alertService.error(data.message);
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  saveRoleData() {

  }

  private getCardTab() {
    this.spinner.show();
    const itemForm = new EmployeeDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeDetailFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('tab_card_search');
    this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        this.cardDatasource = [];
        if (data) {
          data.forEach(element => {
            this.cardDatasource.push({
              id: element.id, no: element.no, date: element.date,
              card_no: element.card_no, status: element.status
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  cardTabEdit(id, date, cardNo, status) {
    this.spinner.show();
    this.displayCardModal = true;
    if (id == 'ADD') {
      this.cardId = null;
      const cardForm = new EmployeeCardForm();
      this.carditemFormGroup = this.formBuilder.group(
        cardForm.employeeCardFormBuilder
      );
      let dateNow = new Date();
      this.carditemFormGroup.controls['date'].setValue(dateNow);
      this.spinner.hide();
    } else {
      this.cardId = id;
      const cardForm = new EmployeeCardForm();
      this.carditemFormGroup = this.formBuilder.group(
        cardForm.employeeCardFormBuilder
      );
      this.carditemFormGroup.controls['id'].setValue(id);
      this.carditemFormGroup.controls['date'].setValue(date);
      this.carditemFormGroup.controls['card_no'].setValue(cardNo);
      this.carditemFormGroup.controls['status'].setValue(status);
      this.spinner.hide();
    }
  }

  saveItemCard() {
    if (this.getCardFormValidationErrors()) {
      this.spinner.show();
      this.displayCardModal = false;
      if (this.carditemFormGroup.controls['id'].value == '0') {
        this.carditemFormGroup.controls['id'].setValue('');
        this.carditemFormGroup.controls['method'].setValue('tab_card_insertupdate');
        this.carditemFormGroup.controls['emp_code'].setValue(this.empCode);
        let cardDate = '';
        if ((typeof this.carditemFormGroup.controls['date'].value === 'string')
          && (this.carditemFormGroup.controls['date'].value.indexOf('/') > -1)) {
          const str = this.carditemFormGroup.controls['date'].value.split('/');
          let year = Number(str[2]);
          const month = Number(str[1]) - 1;
          const date = Number(str[0]);
          let newStopDate = new Date(year, month, date);
          cardDate = this.datepipe.transform(newStopDate, 'dd/MM/yyyy');
        } else {
          cardDate = this.datepipe.transform(this.carditemFormGroup.controls['date'].value, 'dd/MM/yyyy');
        }
        this.carditemFormGroup.controls['date'].patchValue(cardDate);
        this.carditemFormGroup.controls['user_id'].setValue(this.token);
        this.employeeService.ApiEmployee(this.carditemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('cardDatasource-local');
              this.getCardTab();
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
        this.carditemFormGroup.controls['method'].setValue('tab_card_insertupdate');
        this.carditemFormGroup.controls['emp_code'].setValue(this.empCode);
        let cardDate = '';
        if ((typeof this.carditemFormGroup.controls['date'].value === 'string')
          && (this.carditemFormGroup.controls['date'].value.indexOf('/') > -1)) {
          const str = this.carditemFormGroup.controls['date'].value.split('/');
          let year = Number(str[2]);
          const month = Number(str[1]) - 1;
          const date = Number(str[0]);
          let newStopDate = new Date(year, month, date);
          cardDate = this.datepipe.transform(newStopDate, 'dd/MM/yyyy');
        } else {
          cardDate = this.datepipe.transform(this.carditemFormGroup.controls['date'].value, 'dd/MM/yyyy');
        }
        this.carditemFormGroup.controls['date'].patchValue(cardDate);
        this.carditemFormGroup.controls['user_id'].setValue(this.token);
        this.employeeService.ApiEmployee(this.carditemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('cardDatasource-local');
              this.getCardTab();
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

  get fCard() { return this.carditemFormGroup.controls; }

  getCardFormValidationErrors() {
    let valid = true;
    Object.keys(this.carditemFormGroup.controls).forEach(key => {
      this.carditemFormGroup.controls[key].markAsDirty();
      this.carditemFormGroup.controls[key].markAsTouched();
      this.carditemFormGroup.controls[key].markAsPending();
      const controlErrors: ValidationErrors = this.carditemFormGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
        valid = false;
      }
    });
    return valid;
  }

  private getGradeTab() {
    this.spinner.show();
    const itemForm = new EmployeeDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeDetailFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('tab_work_search');
    this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        this.gradeDatasource = [];
        if (data) {
          data.forEach(element => {
            this.gradeDatasource.push({
              id: element.id, no: element.no, no2: element.no2,
              date: element.date, grade: element.grade
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  gradeTabEdit(id, no2, date, grade) {
    this.spinner.show();
    this.displayGradeModal = true;
    if (id == 'ADD') {
      this.gradeId = null;
      const gradeForm = new EmployeeGradeForm();
      this.gradeitemFormGroup = this.formBuilder.group(
        gradeForm.employeeGradeFormBuilder
      );
      let dateNow = new Date();
      this.gradeitemFormGroup.controls['date'].setValue(dateNow);
      this.spinner.hide();
    } else {
      this.gradeId = id;
      const gradeForm = new EmployeeGradeForm();
      this.gradeitemFormGroup = this.formBuilder.group(
        gradeForm.employeeGradeFormBuilder
      );
      this.gradeitemFormGroup.controls['id'].setValue(id);
      this.gradeitemFormGroup.controls['no'].setValue(no2);
      this.gradeitemFormGroup.controls['date'].setValue(date);
      this.gradeitemFormGroup.controls['grade'].setValue(grade);
      this.spinner.hide();
    }
  }

  showModalDialogConfirmDelete(gradeId) {
    this.gradeId = gradeId;
    this.modalConfirmDelete = true;
  }

  deleteGradeItem() {
    this.modalConfirmDelete = false;
    this.spinner.show();
    const gradeForm = new EmployeeGradeForm();
    this.gradeitemFormGroup = this.formBuilder.group(
      gradeForm.employeeGradeFormBuilder
    );
    this.gradeitemFormGroup.controls['method'].setValue('tab_work_delete');
    this.gradeitemFormGroup.controls['id'].setValue(this.gradeId);
    this.gradeitemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.gradeitemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.gradeitemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data.status == 'S') {
          this.alertService.success('success');
          this.localstorageService.removeItem('gradeDatasource-local');
          this.getGradeTab();
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

  getGradeFormValidationErrors() {
    let valid = true;
    Object.keys(this.gradeitemFormGroup.controls).forEach(key => {
      this.gradeitemFormGroup.controls[key].markAsDirty();
      this.gradeitemFormGroup.controls[key].markAsTouched();
      this.gradeitemFormGroup.controls[key].markAsPending();
      const controlErrors: ValidationErrors = this.gradeitemFormGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
        valid = false;
      }
    });
    return valid;
  }

  get fGrade() { return this.gradeitemFormGroup.controls; }

  saveItemGrade() {
    if (this.getGradeFormValidationErrors()) {
      this.spinner.show();
      this.displayGradeModal = false;
      if (this.gradeitemFormGroup.controls['id'].value == '0') {
        this.gradeitemFormGroup.controls['id'].setValue('');
        this.gradeitemFormGroup.controls['method'].setValue('tab_work_insertupdate');
        this.gradeitemFormGroup.controls['emp_code'].setValue(this.empCode);
        let gradeDate = '';
        if ((typeof this.gradeitemFormGroup.controls['date'].value === 'string')
          && (this.gradeitemFormGroup.controls['date'].value.indexOf('/') > -1)) {
          const str = this.gradeitemFormGroup.controls['date'].value.split('/');
          let year = Number(str[2]);
          const month = Number(str[1]) - 1;
          const date = Number(str[0]);
          let newStopDate = new Date(year, month, date);
          gradeDate = this.datepipe.transform(newStopDate, 'dd/MM/yyyy');
        } else {
          gradeDate = this.datepipe.transform(this.gradeitemFormGroup.controls['date'].value, 'dd/MM/yyyy');
        }
        this.gradeitemFormGroup.controls['date'].patchValue(gradeDate);
        this.gradeitemFormGroup.controls['user_id'].setValue(this.token);
        this.employeeService.ApiEmployee(this.gradeitemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('gradeDatasource-local');
              this.getGradeTab();
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
        this.gradeitemFormGroup.controls['method'].setValue('tab_work_insertupdate');
        this.gradeitemFormGroup.controls['emp_code'].setValue(this.empCode);
        let gradeDate = '';
        if ((typeof this.gradeitemFormGroup.controls['date'].value === 'string')
          && (this.gradeitemFormGroup.controls['date'].value.indexOf('/') > -1)) {
          const str = this.gradeitemFormGroup.controls['date'].value.split('/');
          let year = Number(str[2]);
          const month = Number(str[1]) - 1;
          const date = Number(str[0]);
          let newStopDate = new Date(year, month, date);
          gradeDate = this.datepipe.transform(newStopDate, 'dd/MM/yyyy');
        } else {
          gradeDate = this.datepipe.transform(this.gradeitemFormGroup.controls['date'].value, 'dd/MM/yyyy');
        }
        this.gradeitemFormGroup.controls['date'].patchValue(gradeDate);
        this.gradeitemFormGroup.controls['user_id'].setValue(this.token);
        this.employeeService.ApiEmployee(this.gradeitemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('gradeDatasource-local');
              this.getGradeTab();
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

  private getBehaviorTab() {
    this.spinner.show();
    const itemForm = new EmployeeDetailForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.employeeDetailFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('tab_behavior_search');
    this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        this.behaviorDatasource = [];
        if (data) {
          data.forEach(element => {
            this.behaviorDatasource.push({
              id: element.id, no: element.no, year: element.year,
              date: element.date, detail: element.detail, score: element.score, detail2: element.detail2
              , detail_id: element.detail_id
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  deleteBehaviorItem() {
    this.modalConfirmDeleteBehavior = false;
    this.spinner.show();
    const behaviorForm = new EmployeeBehaviorForm();
    this.behavioritemFormGroup = this.formBuilder.group(
      behaviorForm.employeeBehaviorFormBuilder
    );
    this.behavioritemFormGroup.controls['method'].setValue('tab_behavior_delete');
    this.behavioritemFormGroup.controls['id'].setValue(this.behaviorId);
    this.behavioritemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.behavioritemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.behavioritemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data.status == 'S') {
          this.alertService.success('success');
          this.localstorageService.removeItem('behaviorDatasource-local');
          this.getBehaviorTab();
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

  showModalDialogConfirmDeleteBehavior(behaviorId) {
    this.behaviorId = behaviorId;
    this.modalConfirmDeleteBehavior = true;
  }

  get fBehavior() {
    if (this.behavioritemFormGroup.controls['detail_id'].value != null) {
      this.behaviorDetailErrors = false;
    }
    return this.behavioritemFormGroup.controls;
  }

  getBehaviorFormValidationErrors() {
    let valid = true;
    Object.keys(this.behavioritemFormGroup.controls).forEach(key => {
      // alert(key);
      this.behavioritemFormGroup.controls[key].markAsDirty();
      this.behavioritemFormGroup.controls[key].markAsTouched();
      this.behavioritemFormGroup.controls[key].markAsPending();
      const controlErrors: ValidationErrors = this.behavioritemFormGroup.get(key).errors;

      if (controlErrors != null) {
        // alert(JSON.stringify(controlErrors));
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
        valid = false;
      }
    });
    if (this.behavioritemFormGroup.controls['detail_id'].value == null) {
      this.behaviorDetailErrors = true;
      valid = false;
    }
    return valid;
  }

  behaviorTabEdit(id, year, date, detail, score, detail_id, detail2) {
    // alert(detail_id);
    this.spinner.show();
    this.displayBehaviorModal = true;
    if (id == 'ADD') {
      this.behaviorId = null;
      const behaviorForm = new EmployeeBehaviorForm();
      this.behavioritemFormGroup = this.formBuilder.group(
        behaviorForm.employeeBehaviorFormBuilder
      );
      let dateNow = new Date();
      this.behavioritemFormGroup.controls['date'].setValue(dateNow);
      this.spinner.hide();
    } else {
      this.behaviorId = id;
      const behaviorForm = new EmployeeBehaviorForm();
      this.behavioritemFormGroup = this.formBuilder.group(
        behaviorForm.employeeBehaviorFormBuilder
      );
      this.behavioritemFormGroup.controls['id'].setValue(id);
      // this.behavioritemFormGroup.controls['year'].setValue(year);
      this.behavioritemFormGroup.controls['date'].setValue(date);
      this.behavioritemFormGroup.controls['detail'].setValue(detail);
      this.behavioritemFormGroup.controls['detail2'].setValue(detail2);
      this.behavioritemFormGroup.controls['score'].setValue(score);
      this.behavioritemFormGroup.controls['detail_id'].patchValue(detail_id);
      // this.behavioritemFormGroup.controls['detail_id'].setValue(detail_id);
      this.spinner.hide();
    }
  }

  saveItemBehavior() {
    console.log(this.behavioritemFormGroup.value);

    if (this.getBehaviorFormValidationErrors()) {
      // console.log(this.behavioritemFormGroup.getRawValue());
      // return;
      this.spinner.show();
      this.displayBehaviorModal = false;
      if (this.behavioritemFormGroup.controls['id'].value == '0') {
        this.behavioritemFormGroup.controls['id'].setValue('');
        this.behavioritemFormGroup.controls['method'].setValue('tab_behavior_insertupdate');
        this.behavioritemFormGroup.controls['emp_code'].setValue(this.empCode);
        let behaviorDate = '';
        if ((typeof this.behavioritemFormGroup.controls['date'].value === 'string')
          && (this.behavioritemFormGroup.controls['date'].value.indexOf('/') > -1)) {
          const str = this.behavioritemFormGroup.controls['date'].value.split('/');
          let year = Number(str[2]);
          const month = Number(str[1]) - 1;
          const date = Number(str[0]);
          let newStopDate = new Date(year, month, date);
          behaviorDate = this.datepipe.transform(newStopDate, 'dd/MM/yyyy');
        } else {
          behaviorDate = this.datepipe.transform(this.behavioritemFormGroup.controls['date'].value, 'dd/MM/yyyy');
        }
        this.behavioritemFormGroup.controls['date'].patchValue(behaviorDate);
        this.behavioritemFormGroup.controls['user_id'].setValue(this.token);
        this.behavioritemFormGroup.controls['detail'].setValue(this.behavioritemFormGroup.controls['detail2'].value);
        this.employeeService.ApiEmployee(this.behavioritemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('behaviorDatasource-local');
              this.getBehaviorTab();
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
        this.behavioritemFormGroup.controls['method'].setValue('tab_behavior_insertupdate');
        this.behavioritemFormGroup.controls['emp_code'].setValue(this.empCode);
        // this.gradeitemFormGroup.controls['user_id'].setValue('1');
        let behaviorDate = '';
        if ((typeof this.behavioritemFormGroup.controls['date'].value === 'string')
          && (this.behavioritemFormGroup.controls['date'].value.indexOf('/') > -1)) {
          const str = this.behavioritemFormGroup.controls['date'].value.split('/');
          let year = Number(str[2]);
          const month = Number(str[1]) - 1;
          const date = Number(str[0]);
          let newStopDate = new Date(year, month, date);
          behaviorDate = this.datepipe.transform(newStopDate, 'dd/MM/yyyy');
        } else {
          behaviorDate = this.datepipe.transform(this.behavioritemFormGroup.controls['date'].value, 'dd/MM/yyyy');
        }
        this.behavioritemFormGroup.controls['date'].patchValue(behaviorDate);
        this.behavioritemFormGroup.controls['user_id'].setValue(this.token);
        this.employeeService.ApiEmployee(this.behavioritemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('behaviorDatasource-local');
              this.getBehaviorTab();
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

  exportBehavior() {
    this.behavioritemFormGroup.controls['method'].setValue('tab_behavior_export');
    this.behavioritemFormGroup.controls['emp_code'].setValue(this.empCode);
    this.behavioritemFormGroup.controls['user_id'].setValue(this.token);
    this.employeeService.ApiEmployee(this.behavioritemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data.status == 'S') {
          window.open(data.value, '_blank');
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

  funcSelectDateFrom(event, tab) {
    let dateFrom = new Date(event);
    let month = dateFrom.getMonth() + 1;
    let year = dateFrom.getFullYear();
    let prevMonth = (month === 0) ? 12 : month - 1;
    let prevYear = (prevMonth === 12) ? year - 1 : year;
    if (tab == 'inout') {
      this.inoutminDate = new Date(event);
      this.inoutminDate.setMonth(prevMonth);
      this.inoutminDate.setFullYear(prevYear);
      let dateTo = new Date(this.inoutDateTo);
      if (dateFrom > dateTo) {
        this.inoutDateTo = dateFrom;
      }
    }
    else if (tab == 'leave') {
      this.leaveminDate = new Date(event);
      this.leaveminDate.setMonth(prevMonth);
      this.leaveminDate.setFullYear(prevYear);
      let dateTo = new Date(this.leaveDateTo);
      if (dateFrom > dateTo) {
        this.leaveDateTo = dateFrom;
      }
    } else if (tab == 'OT') {
      this.OTminDate = new Date(event);
      this.OTminDate.setMonth(prevMonth);
      this.OTminDate.setFullYear(prevYear);
      let dateTo = new Date(this.OTDateTo);
      if (dateFrom > dateTo) {
        this.OTDateTo = dateFrom;
      }
    }

  }

  onUpload(event) {
    this.spinner.show();
    this.fileBase64 = null;
    let file: File = event.files[0];
    let myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.fileBase64 = myReader.result;
    };
    myReader.readAsDataURL(file);
    setTimeout(() => {
      const itemForm = new EmployeeDetailForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.employeeDetailFormBuilder
      );
      this.itemFormGroup.controls['method'].setValue('upload_file');
      this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
      this.itemFormGroup.controls['img'].setValue(this.fileBase64);
      this.itemFormGroup.controls['user_id'].setValue(this.token);
      this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data.status == 'S') {
            const itemFormImg = new EmployeeDetailForm();
            this.itemFormGroup = this.formBuilder.group(
              itemFormImg.employeeDetailFormBuilder
            );
            this.itemFormGroup.controls['method'].setValue('get_upload_file');
            this.itemFormGroup.controls['emp_code'].setValue(this.empCode);
            this.itemFormGroup.controls['user_id'].setValue(this.token);
            this.employeeService.ApiEmployee(this.itemFormGroup.getRawValue()).subscribe(
              (sub) => {
                if (sub.status == 'S') {
                  this.imageItem = sub.value;
                } else {
                  this.imageItem = null;
                }
              }, (subErr) => {
                this.alertService.error(subErr);
              });
            this.alertService.success('upload success');
          } else {
            this.imageItem = null;
          }
          event.clear();
          this.spinner.hide();
        }, (err) => {
          this.spinner.hide();
          this.alertService.error(err);
        });
    }, 2000);
  }

}
