import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { BookingRoomConfigForm } from './booking-room-config.form';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { MeetingroomService } from 'src/app/services/meetingroom/meetingroom.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-room-config',
  templateUrl: './booking-room-config.component.html',
  styleUrls: ['./booking-room-config.component.scss']
})
export class BookingRoomConfigComponent implements OnInit {
  token;
  currentUser: any;
  itemFormGroup: FormGroup;
  bookingRoomId;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private meetingroomService: MeetingroomService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private route: ActivatedRoute,
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      const token = JSON.parse(this.localstorageService.getLocalStorage('tokenStandardCan'));
      this.token = token;
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }
  }

  ngOnInit(): void {
    const itemForm = new BookingRoomConfigForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.bookingRoomConfigFormBuilder
    );
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookingRoomId = id;
      this.getDetail();
    }
    else {
      this.bookingRoomId = '';
      this.getDetail();
      this.spinner.hide();
    }
  }

  get f() { return this.itemFormGroup.controls; }

  private getDetail() {
    const itemForm = new BookingRoomConfigForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.bookingRoomConfigFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('detail');
    this.itemFormGroup.controls['id'].setValue(this.bookingRoomId ?? '');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.meetingroomService.ApiBookingRoomConfig(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.itemFormGroup.controls['id'].patchValue(data.id);
          this.itemFormGroup.controls['timeconfig'].patchValue(data.value);
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  saveItem() {
    if (this.getFormValidationErrors()) {
      this.spinner.show();
      this.itemFormGroup.controls['method'].setValue('update');
      this.itemFormGroup.controls['user_id'].setValue(this.token);
      this.itemFormGroup.controls['id'].setValue(this.bookingRoomId ?? '');
      this.meetingroomService.ApiBookingRoomConfig(this.itemFormGroup.getRawValue()).subscribe(
        (data) => {
          if (data.status == 'S') {
            this.alertService.success('success');
            this.bookingRoomId = data.value;
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

}
