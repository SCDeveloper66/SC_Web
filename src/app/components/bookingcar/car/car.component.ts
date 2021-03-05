import { Component, OnInit } from '@angular/core';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { BookingcarService } from 'src/app/services/bookingcar/bookingcar.service';
import { FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { CarForm } from './car.form';
import { Table } from 'primeng/table';
import { SelectItem } from 'primeng/api';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {
  token;
  currentUser: any;
  carType;
  car;
  carTypeFromsSave: SelectItem[] = [];
  carTypes: SelectItem[] = [];
  cars: SelectItem[] = [];
  itemId;
  cols: any[];
  datasource: any[];
  carFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  public displayModal = false;
  public modalConfirmDelete = false;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private bookingcarService: BookingcarService,
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
    const carForm = new CarForm();
    this.carFormGroup = this.formBuilder.group(
      carForm.CarFormBuilder
    );
    const itemForm = new CarForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.CarFormBuilder
    );
    this.getMasterDDL();
    this.cols = [
      { field: 'number', header: '#', sortable: true },
      { field: 'car_type', header: 'ประเภทรถ', sortable: true },
      { field: 'name', header: 'ทะเบียนรถ', sortable: true },
      { field: 'detail', header: 'รายละเอียด', sortable: true },
      { field: 'action', header: 'Action', sortable: true }
    ];
    this.getCarList();
  }

  private getMasterDDL() {
    const carForm = new CarForm();
    this.carFormGroup = this.formBuilder.group(
      carForm.CarFormBuilder
    );
    this.carFormGroup.controls['method'].setValue('master');
    this.carFormGroup.controls['user_id'].setValue(this.token);
    this.bookingcarService.ApiCar(this.carFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.carTypeFromsSave = [];
          this.carTypes = [];
          this.cars = [];
          data.car_type.forEach(m => {
            this.carTypeFromsSave.push({ value: m.code, label: m.text });
            this.carTypes.push({ value: m.code, label: m.text });
          });
          // data.car_license.forEach(m => {
          //   this.cars.push({ value: m.code, label: m.text });
          // });
        }
      }, (err) => {
        this.alertService.error(err);
      });
  }

  carTypeChange(event) {
    this.cars = [];
    this.getDataByCarType(event.value, this.cars);
  }
  private getDataByCarType(carType, cars) {
    const carForm = new CarForm();
    this.carFormGroup = this.formBuilder.group(
      carForm.CarFormBuilder
    );
    this.carFormGroup.controls['method'].setValue('master');
    this.carFormGroup.controls['user_id'].setValue(this.token);
    this.carFormGroup.controls['carTypes'].setValue(carType);
    this.bookingcarService.ApiCar(this.carFormGroup.getRawValue()).subscribe(
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

  get f() { return this.itemFormGroup.controls; }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getCarList();
  }

  private getCarList() {
    this.localstorageService.removeItem('datasource-local');
    this.spinner.show();
    this.carType = this.carType == null ? '' : this.carType;
    this.car = this.car == null ? '' : this.car;
    this.carFormGroup.controls['method'].setValue('search');
    this.carFormGroup.controls['car_type_from'].setValue(this.carType);
    this.carFormGroup.controls['car_type_to'].setValue(this.carType);
    this.carFormGroup.controls['car_from'].setValue(this.car);
    this.carFormGroup.controls['car_to'].setValue(this.car);
    this.carFormGroup.controls['user_id'].setValue(this.token);
    this.bookingcarService.ApiCar(this.carFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          let i = 0;
          data.forEach(element => {
            i++;
            this.datasource.push({
              id: element.id,
              number: i,
              car_type_id: element.car_type_id,
              car_type: element.car_type,
              name: element.name,
              detail: element.detail,
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

  showModalDialogDetail(id, carType, name, desc, color) {
    this.spinner.show();
    if (id == 'ADD') {
      this.itemId = null;
      const itemForm = new CarForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.CarFormBuilder
      );
      this.displayModal = true;
      this.spinner.hide();
    } else {
      this.itemId = id;
      const itemForm = new CarForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.CarFormBuilder
      );
      this.itemFormGroup.controls['id'].setValue(id);
      this.itemFormGroup.controls['car_type'].setValue(carType);
      this.itemFormGroup.controls['name'].setValue(name);
      this.itemFormGroup.controls['detail'].setValue(desc);
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
        this.bookingcarService.ApiCar(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getCarList();
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
        this.bookingcarService.ApiCar(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getCarList();
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
    const itemForm = new CarForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.CarFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('delete');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.itemFormGroup.controls['id'].setValue(this.itemId);
    this.bookingcarService.ApiCar(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data.status == 'S') {
          this.alertService.success('success');
          this.localstorageService.removeItem('datasource-local');
          this.getCarList();
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
