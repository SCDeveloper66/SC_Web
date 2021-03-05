import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { MeetingroomService } from 'src/app/services/meetingroom/meetingroom.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { Table } from 'primeng/table';
import { ConfigMeetingForm } from './config-meeting.form';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';

@Component({
  selector: 'app-config-meeting',
  templateUrl: './config-meeting.component.html',
  styleUrls: ['./config-meeting.component.scss']
})
export class ConfigMeetingComponent implements OnInit {
  token;
  currentUser: any;
  desc;
  itemId;
  cols: any[];
  datasource: any[];
  configMeetingFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  public displayModal = false;
  public modalConfirmDelete = false;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private meetingroomService: MeetingroomService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      const token = JSON.parse(this.localstorageService.getLocalStorage('tokenStandardCan'));
      this.token = token;
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }
    this.localstorageService.removeItem('datasource-local');
  }

  ngOnInit(): void {
    this.datasource = [];
    const configMeetingForm = new ConfigMeetingForm();
    this.configMeetingFormGroup = this.formBuilder.group(
      configMeetingForm.configMeetingFormBuilder
    );
    const itemForm = new ConfigMeetingForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.configMeetingFormBuilder
    );
    this.cols = [
      { field: 'number', header: '#', sortable: true },
      { field: 'timelimit', header: 'เวลาไม่เกิน(นาที)', sortable: true },
      { field: 'detail', header: 'คำอธิบาย', sortable: true },
      { field: 'score', header: 'คะแนน', sortable: true },
      { field: 'action', header: 'Action', sortable: true }
    ];
    this.getConfigMeetingList();
  }

  get f() { return this.itemFormGroup.controls; }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getConfigMeetingList();
  }

  private getConfigMeetingList() {
    this.spinner.show();
    this.localstorageService.removeItem('datasource-local');
    this.desc = this.desc == null ? '' : this.desc;
    this.configMeetingFormGroup.controls['method'].setValue('search');
    this.configMeetingFormGroup.controls['desc'].setValue(this.desc);
    this.configMeetingFormGroup.controls['user_id'].setValue(this.token);
    this.meetingroomService.ApiConfigMeeting(this.configMeetingFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          let i = 0;
          data.forEach(element => {
            i++;
            this.datasource.push({ id: element.id, number: i, timelimit: element.timelimit, detail: element.detail, score: element.score });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  showModalDialogDetail(id, timelimit, desc, score) {
    this.spinner.show();
    if (id == 'ADD') {
      this.itemId = null;
      const itemForm = new ConfigMeetingForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.configMeetingFormBuilder
      );
      this.displayModal = true;
      this.spinner.hide();
    } else {
      this.itemId = id;
      const itemForm = new ConfigMeetingForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.configMeetingFormBuilder
      );
      this.itemFormGroup.controls['id'].setValue(id);
      this.itemFormGroup.controls['timelimit'].setValue(timelimit);
      this.itemFormGroup.controls['desc'].setValue(desc);
      this.itemFormGroup.controls['score'].setValue(score);
      this.displayModal = true;
      this.spinner.hide();
    }
  }


  saveItem() {
    if (this.getFormValidationErrors()) {
      this.spinner.show();
      this.displayModal = false;
      if (this.itemFormGroup.controls['id'].value == '0') {
        this.itemFormGroup.controls['id'].setValue('');
        this.itemFormGroup.controls['method'].setValue('insert');
        this.itemFormGroup.controls['user_id'].setValue(this.token);
        this.meetingroomService.ApiConfigMeeting(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getConfigMeetingList();
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
        this.itemFormGroup.controls['method'].setValue('update');
        this.itemFormGroup.controls['user_id'].setValue(this.token);
        this.meetingroomService.ApiConfigMeeting(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getConfigMeetingList();
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
    Object.keys(this.itemFormGroup.controls).forEach(key => {
      this.itemFormGroup.controls[key].markAsDirty();
      this.itemFormGroup.controls[key].markAsTouched();
      this.itemFormGroup.controls[key].markAsPending();
      const controlErrors: ValidationErrors = this.itemFormGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
        valid = false;
      }
    });
    return valid;
  }

  showModalDialogConfirmDelete(itemId) {
    this.itemId = itemId;
    this.modalConfirmDelete = true;
  }

  showModalDialogCancelDelete() {
    this.itemId = '';
    this.modalConfirmDelete = false;
  }

  deleteItem() {
    this.modalConfirmDelete = false;
    this.spinner.show();
    this.itemFormGroup.controls['method'].setValue('delete');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.itemFormGroup.controls['id'].setValue(this.itemId);
    this.meetingroomService.ApiConfigMeeting(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data.status == 'S') {
          this.alertService.success('success');
          this.localstorageService.removeItem('datasource-local');
          this.getConfigMeetingList();
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
