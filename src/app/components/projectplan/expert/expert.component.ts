import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { ProjectplanService } from 'src/app/services/projectplan/projectplan.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { ExpertForm } from './expert.form';
import { Table } from 'primeng/table';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';

@Component({
  selector: 'app-expert',
  templateUrl: './expert.component.html',
  styleUrls: ['./expert.component.scss']
})
export class ExpertComponent implements OnInit {
  token;
  currentUser: any;
  expertName;
  itemId;
  cols: any[];
  datasource: any[];
  expertFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  public displayModal = false;
  public modalConfirmDelete = false;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private projectplanService: ProjectplanService,
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
    const expertForm = new ExpertForm();
    this.expertFormGroup = this.formBuilder.group(
      expertForm.expertFormBuilder
    );
    const itemForm = new ExpertForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.expertFormBuilder
    );
    this.cols = [
      { field: 'number', header: '#', sortable: true },
      { field: 'name', header: 'ชื่อวิทยากร', sortable: true },
      { field: 'tel', header: 'เบอร์ติดต่อ', sortable: true },
      { field: 'action', header: 'Action', sortable: true }
    ];
    this.getExpertList();
  }

  get f() { return this.itemFormGroup.controls; }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getExpertList();
  }

  private getExpertList() {
    this.spinner.show();
    this.localstorageService.removeItem('datasource-local');
    this.expertName = this.expertName == null ? '' : this.expertName;
    this.expertFormGroup.controls['method'].setValue('search');
    this.expertFormGroup.controls['name'].setValue(this.expertName);
    this.expertFormGroup.controls['user_id'].setValue(this.token);
    this.projectplanService.ApiExpert(this.expertFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          let i = 0;
          data.forEach(element => {
            i++;
            this.datasource.push({ id: element.id, number: i, name: element.name, tel: element.tel });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  showModalDialogDetail(id, name, tel) {
    this.spinner.show();
    if (id == 'ADD') {
      this.itemId = null;
      const itemForm = new ExpertForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.expertFormBuilder
      );
      this.displayModal = true;
      this.spinner.hide();
    } else {
      this.itemId = id;
      const itemForm = new ExpertForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.expertFormBuilder
      );
      this.itemFormGroup.controls['id'].setValue(id);
      this.itemFormGroup.controls['name'].setValue(name);
      this.itemFormGroup.controls['tel'].setValue(tel);
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
        this.projectplanService.ApiExpert(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getExpertList();
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
        this.projectplanService.ApiExpert(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getExpertList();
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
    this.projectplanService.ApiExpert(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data.status == 'S') {
          this.alertService.success('success');
          this.localstorageService.removeItem('datasource-local');
          this.getExpertList();
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
