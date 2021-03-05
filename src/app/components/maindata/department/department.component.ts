import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { BookingcarService } from 'src/app/services/bookingcar/bookingcar.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { DepartmentForm } from './department.form';
import { Table } from 'primeng/table';
import { MainDataService } from 'src/app/services/maindata/maindata.service';
// declare var search_Dptdata: any;

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  token;
  currentUser: any;
  department;
  itemId;
  cols: any[];
  datasource: any[];
  departmentFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  public displayModal = false;
  public modalConfirmDelete = false;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private mainDataService: MainDataService,
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
    // new search_Dptdata();
    this.datasource = [];
    const departmentForm = new DepartmentForm();
    this.departmentFormGroup = this.formBuilder.group(
      departmentForm.DepartmentFormBuilder
    );
    const itemForm = new DepartmentForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.DepartmentFormBuilder
    );
    this.cols = [
      { field: 'number', header: '#', sortable: true },
      { field: 'code', header: 'รหัส', sortable: true },
      { field: 'name', header: 'ชื่อแผนก', sortable: true },
      { field: 'tel', header: 'เบอร์ติดต่อ', sortable: true },
      { field: 'dis_status_dis', header: 'แสดงบน Mobile', sortable: true },
      { field: 'action', header: 'Action', sortable: true }
    ];
    this.getDepartmentList();
  }

  get f() { return this.itemFormGroup.controls; }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getDepartmentList();
  }

  private getDepartmentList() {
    this.spinner.show();
    this.department = this.department == null ? '' : this.department;
    this.departmentFormGroup.controls['method'].setValue('search');
    this.departmentFormGroup.controls['name'].setValue(this.department);
    this.departmentFormGroup.controls['user_id'].setValue(this.token);
    this.mainDataService.ApiDepartment(this.departmentFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          let i = 0;
          data.forEach(element => {
            i++;
            this.datasource.push({
              number: i,
              id: element.id,
              code: element.code,
              name: element.name,
              tel: element.tel,
              dis_status: element.dis_status,
              dis_status_dis: element.dis_status_dis,
              detail: element.detail
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  showModalDialogDetail(id, tel, disStatus: boolean) {
    this.spinner.show();
    if (id == 'ADD') {
      this.itemId = null;
      const itemForm = new DepartmentForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.DepartmentFormBuilder
      );
      this.displayModal = true;
      this.spinner.hide();
    } else {
      this.itemId = id;
      const itemForm = new DepartmentForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.DepartmentFormBuilder
      );
      this.itemFormGroup.controls['id'].setValue(id);
      this.itemFormGroup.controls['tel'].setValue(tel);
      this.itemFormGroup.controls['dis_status'].setValue(disStatus);
      this.displayModal = true;
      this.spinner.hide();
    }
  }

  saveItem() {
    if (this.getFormValidationErrors()) {
      this.spinner.show();
      this.displayModal = false;
      if (this.itemFormGroup.controls['id'].value == '0') {
        // this.itemFormGroup.controls['method'].setValue('insert');
        // this.itemFormGroup.controls['user_id'].setValue(this.token);
        // this.mainDataService.ApiDepartment(this.itemFormGroup.getRawValue()).subscribe(
        //   (data) => {
        //     if (data.status == 'S') {
        //       this.alertService.success('success');
        //       this.localstorageService.removeItem('datasource-local');
        //       this.getDepartmentList();
        //     } else {
        //       this.alertService.error(data.message);
        //     }
        //     this.spinner.hide();
        //   },
        //   (err) => {
        //     this.spinner.hide();
        //     this.alertService.error(err);
        //   }
        // );
      } else {
        this.itemFormGroup.controls['method'].setValue('update');
        this.itemFormGroup.controls['user_id'].setValue(this.token);
        this.mainDataService.ApiDepartment(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getDepartmentList();
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

  // showModalDialogConfirmDelete(itemId) {
  //   this.itemId = itemId;
  //   this.modalConfirmDelete = true;
  // }

  // showModalDialogCancelDelete() {
  //   this.itemId = '';
  //   this.modalConfirmDelete = false;
  // }

  // deleteItem() {
  //   this.modalConfirmDelete = false;
  //   this.spinner.show();
  //   this.itemFormGroup.controls['method'].setValue('delete');
  //   this.itemFormGroup.controls['user_id'].setValue(this.token);
  //   this.itemFormGroup.controls['id'].setValue(this.itemId);
  //   this.mainDataService.ApiDepartment(this.itemFormGroup.getRawValue()).subscribe(
  //     (data) => {
  //       if (data.status == 'S') {
  //         this.alertService.success('success');
  //         this.localstorageService.removeItem('datasource-local');
  //         this.getDepartmentList();
  //       } else {
  //         this.alertService.error(data.message);
  //       }
  //       this.spinner.hide();
  //     },
  //     (err) => {
  //       this.spinner.hide();
  //       this.alertService.error(err);
  //     }
  //   );
  // }

}
