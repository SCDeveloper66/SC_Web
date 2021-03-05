import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { MainDataService } from 'src/app/services/maindata/maindata.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { BenefitsForm } from './benefits.form';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss']
})
export class BenefitsComponent implements OnInit {
  token;
  currentUser: any;
  title;
  itemId;
  cols: any[];
  datasource: any[];
  benefitsFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  public displayModal = false;
  public modalConfirmDelete = false;
  detailData: any;
  psdFile;
  fileBase64;
  public displayUrl = false;
  dataUrl;
  fileName;

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
    this.datasource = [];
    const benefitsForm = new BenefitsForm();
    this.benefitsFormGroup = this.formBuilder.group(
      benefitsForm.benefitsFormBuilder
    );
    const itemForm = new BenefitsForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.benefitsFormBuilder
    );
    this.cols = [
      { field: 'number', header: '#', sortable: true },
      { topic: 'title', header: 'หัวข้อ', sortable: true },
      { topic: 'detail', header: 'รายละเอียด', sortable: true },
      { field: 'action', header: 'Action', sortable: true }
    ];
    this.getBenefitsList();
  }

  get f() { return this.itemFormGroup.controls; }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getBenefitsList();
  }

  private getBenefitsList() {
    this.spinner.show();
    this.title = this.title == null ? '' : this.title;
    this.benefitsFormGroup.controls['method'].setValue('search');
    this.benefitsFormGroup.controls['title'].setValue(this.title);
    this.benefitsFormGroup.controls['user_id'].setValue(this.token);
    this.mainDataService.ApiBenefits(this.benefitsFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          this.detailData = data.benefitData;
          let i = 0;
          data.benefitData.forEach(element => {
            i++;
            this.datasource.push({
              id: element.id,
              number: i,
              title: element.title,
              detail: element.detail,
              url: element.url,
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  showModalDialogDetail(id, title, detail, url) {
    this.spinner.show();
    this.psdFile = '';
    if (id == 'ADD') {
      this.displayUrl = false;
      this.itemId = null;
      const itemForm = new BenefitsForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.benefitsFormBuilder
      );
      this.displayModal = true;
      this.spinner.hide();
    } else {
      this.displayUrl = true;
      this.dataUrl = url;
      this.itemId = id;
      const itemForm = new BenefitsForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.benefitsFormBuilder
      );
      this.itemFormGroup.controls['id'].setValue(id);
      this.itemFormGroup.controls['title'].setValue(title);
      this.itemFormGroup.controls['detail'].setValue(detail);
      this.itemFormGroup.controls['url'].setValue(url);
      this.fileName = title;
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
        this.itemFormGroup.controls['doc'].setValue(this.fileBase64);
        this.itemFormGroup.controls['user_id'].setValue(this.token);
        this.mainDataService.ApiBenefits(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getBenefitsList();
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
        this.itemFormGroup.controls['url'].setValue(this.dataUrl);
        this.itemFormGroup.controls['doc'].setValue(this.fileBase64);
        this.itemFormGroup.controls['user_id'].setValue(this.token);
        this.mainDataService.ApiBenefits(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getBenefitsList();
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
    this.mainDataService.ApiBenefits(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data.status == 'S') {
          this.alertService.success('success');
          this.localstorageService.removeItem('datasource-local');
          this.getBenefitsList();
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

  deleteFile() {
    this.dataUrl = '';
    this.fileName = '';
  }

  changeListener($event): void {
    this.readThis($event.target);
    this.deleteFile();
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.fileBase64 = myReader.result;
    };
    myReader.readAsDataURL(file);
  }

}
