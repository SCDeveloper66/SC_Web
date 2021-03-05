import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { MeetingroomService } from 'src/app/services/meetingroom/meetingroom.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { RoomForm } from './room.form';
import { Table } from 'primeng/table';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  token;
  currentUser: any;
  roomCode;
  itemId;
  cols: any[];
  datasource: any[];
  roomFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  colors: SelectItem[] = [];
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
    const roomForm = new RoomForm();
    this.roomFormGroup = this.formBuilder.group(
      roomForm.roomFormBuilder
    );
    const itemForm = new RoomForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.roomFormBuilder
    );
    this.cols = [
      { field: 'number', header: '#', sortable: true },
      { field: 'code', header: 'ชื่อห้องประชุม', sortable: true },
      { field: 'name', header: 'รายละเอียด', sortable: true },
      { field: 'action', header: 'Action', sortable: true }
    ];
    this.getRoomList();
  }

  get f() { return this.itemFormGroup.controls; }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getRoomList();
  }

  private getRoomList() {
    this.spinner.show();
    const roomForm = new RoomForm();
    this.roomFormGroup = this.formBuilder.group(
      roomForm.roomFormBuilder
    );
    this.localstorageService.removeItem('datasource-local');
    this.roomCode = this.roomCode == null ? '' : this.roomCode;
    this.roomFormGroup.controls['method'].setValue('search');
    this.roomFormGroup.controls['code'].setValue(this.roomCode);
    this.roomFormGroup.controls['user_id'].setValue(this.token);
    this.meetingroomService.ApiRoom(this.roomFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          let i = 0;
          data.forEach(element => {
            i++;
            this.datasource.push({
              id: element.id,
              number: i,
              name: element.name,
              code: element.code,
              color: element.color
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  showModalDialogDetail(id, name, code, color) {
    this.spinner.show();
    if (id == 'ADD') {
      this.itemId = null;
      const itemForm = new RoomForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.roomFormBuilder
      );
      this.displayModal = true;
      this.spinner.hide();
    } else {
      this.itemId = id;
      const itemForm = new RoomForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.roomFormBuilder
      );
      this.itemFormGroup.controls['id'].setValue(id);
      this.itemFormGroup.controls['name'].setValue(name);
      this.itemFormGroup.controls['code'].setValue(code);
      this.itemFormGroup.controls['color'].setValue(color);
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
        this.meetingroomService.ApiRoom(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getRoomList();
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
        this.meetingroomService.ApiRoom(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getRoomList();
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
    this.meetingroomService.ApiRoom(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data.status == 'S') {
          this.alertService.success('success');
          this.localstorageService.removeItem('datasource-local');
          this.getRoomList();
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
