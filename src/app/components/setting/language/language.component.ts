import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { UserRoleService } from 'src/app/services/user-role/user-role.service';
import { LanguageForm } from './language.form';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  token;
  currentUser: any;
  cols: any[];
  datasource: any[];
  langFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  itemId;
  public displayModal = false;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private userRoleService: UserRoleService,
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
    const itemForm = new LanguageForm();
    this.langFormGroup = this.formBuilder.group(
      itemForm.LanguageFormBuilder
    );
    this.itemFormGroup = this.formBuilder.group(
      itemForm.LanguageFormBuilder
    );
    this.datasource = [];
    this.cols = [
      { field: 'param', header: 'ชื่อตัวแปร', sortable: true },
      { field: 'en', header: 'English', sortable: true },
      { field: 'th', header: 'ภาษาไทย', sortable: true },
      { field: 'my', header: 'မြန်မာဘာသာ', sortable: true },
      { field: 'action', header: 'Action', sortable: true }
    ];
    this.getLanguageList();
  }

  get f() { return this.langFormGroup.controls; }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getLanguageList();
  }

  private getLanguageList() {
    this.localstorageService.removeItem('datasource-local');
    this.spinner.show();
    const itemForm = new LanguageForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.LanguageFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('search');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.userRoleService.ApiLanguage(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        debugger;
        if (data) {
          let i = 0;
          data.forEach(element => {
            i++;
            this.datasource.push({
              id: element.id,
              param: element.param,
              en: element.en,
              th: element.th,
              my: element.my
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  showModalDialogDetail(id, param, en, th, my) {
    this.spinner.show();
    if (id == 'ADD') {
      this.itemId = null;
      const itemForm = new LanguageForm();
      this.langFormGroup = this.formBuilder.group(
        itemForm.LanguageFormBuilder
      );
      this.displayModal = true;
      this.spinner.hide();
    }
    else {
      this.itemId = id;
      const itemForm = new LanguageForm();
      this.langFormGroup = this.formBuilder.group(
        itemForm.LanguageFormBuilder
      );
      this.langFormGroup.controls['id'].setValue(id);
      this.langFormGroup.controls['param'].setValue(param);
      this.langFormGroup.controls['en'].setValue(en);
      this.langFormGroup.controls['th'].setValue(th);
      this.langFormGroup.controls['my'].setValue(my);
      this.displayModal = true;
      this.spinner.hide();
    }
  }

  saveItem() {
    if (this.getFormValidationErrors()) {
      this.spinner.show();
      this.displayModal = false;
      if (this.langFormGroup.controls['id'].value == '0') {
        this.langFormGroup.controls['id'].setValue('');
        this.langFormGroup.controls['method'].setValue('insert');
        this.langFormGroup.controls['user_id'].setValue(this.token);
        this.userRoleService.ApiLanguage(this.langFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getLanguageList();
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
      else {
        this.langFormGroup.controls['method'].setValue('update');
        this.langFormGroup.controls['user_id'].setValue(this.token);
        this.userRoleService.ApiLanguage(this.langFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getLanguageList();
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
    Object.keys(this.langFormGroup.controls).forEach(key => {
      this.langFormGroup.controls[key].markAsDirty();
      this.langFormGroup.controls[key].markAsTouched();
      this.langFormGroup.controls[key].markAsPending();
      const controlErrors: ValidationErrors = this.langFormGroup.get(key).errors;
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
