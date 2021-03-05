import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { MainDataService } from 'src/app/services/maindata/maindata.service';
import { ImageSlideForm } from './image-slide.form';

@Component({
  selector: 'app-image-slide',
  templateUrl: './image-slide.component.html',
  styleUrls: ['./image-slide.component.scss']
})
export class ImageSlideComponent implements OnInit {
  token;
  currentUser: any;
  itemId;
  cols: any[];
  datasource: any[];
  imageSlideFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  public displayModal = false;
  public modalConfirmDelete = false;
  psdFile;
  fileBase64;
  dataUrl;

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
    this.spinner.show();
    this.datasource = [];
    this.cols = [
      { field: 'no', header: '#', sortable: true },
      { field: 'base64', header: 'รูป', sortable: true },
      { field: 'url', header: 'Link', sortable: true },
      { field: 'action', header: 'Action', sortable: true }
    ];
    const imageSlideForm = new ImageSlideForm();
    this.imageSlideFormGroup = this.formBuilder.group(
      imageSlideForm.ImageSlideFormBuilder
    );
    const itemForm = new ImageSlideForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.ImageSlideFormBuilder
    );
    this.getImageSlideList();
  }

  get f() { return this.imageSlideFormGroup.controls; }

  private getImageSlideList() {
    this.localstorageService.removeItem('datasource-local');
    this.spinner.show();
    this.itemFormGroup.controls['method'].setValue('search');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.mainDataService.ApiImageSlide(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          if (data.message.status == 'S') {
            let i = 0;
            data.imageSlideData.forEach(element => {
              i++;
              this.datasource.push({
                no: i,
                id: element.id,
                img: element.img,
                base64: element.base64,
                url: element.url,
                order: element.order,
                ref_id: element.ref_id,
              });
            });
          } else {
            this.alertService.error(data.message.message);
          }
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  showModalDialogDetail(id, img, url, order) {
    this.spinner.show();
    this.psdFile = '';
    if (id == 'ADD') {
      this.itemId = null;
      const itemForm = new ImageSlideForm();
      this.imageSlideFormGroup = this.formBuilder.group(
        itemForm.ImageSlideFormBuilder
      );
      this.displayModal = true;
      this.spinner.hide();
    } else {
      this.itemId = id;
      const itemForm = new ImageSlideForm();
      this.imageSlideFormGroup = this.formBuilder.group(
        itemForm.ImageSlideFormBuilder
      );
      this.imageSlideFormGroup.controls['id'].setValue(id);
      // this.imageSlideFormGroup.controls['img'].setValue(img);
      this.fileBase64 = 'data:image/png;base64,' + img;
      this.imageSlideFormGroup.controls['url'].setValue(url);
      this.imageSlideFormGroup.controls['order'].setValue(order);
      this.displayModal = true;
      this.spinner.hide();
    }
  }

  saveItem() {
    if (this.getFormValidationErrors()) {
      this.displayModal = false;
      if (this.imageSlideFormGroup.controls['id'].value == '0') {
        if (this.fileBase64 == null) {
          this.alertService.warning('Img required');
          return false;
        } else if (this.fileBase64 == '') {
          this.alertService.warning('Img required');
          return false;
        }
        this.spinner.show();
        this.imageSlideFormGroup.controls['id'].setValue('');
        this.imageSlideFormGroup.controls['method'].setValue('insert');
        this.imageSlideFormGroup.controls['img'].setValue(this.fileBase64);
        this.imageSlideFormGroup.controls['user_id'].setValue(this.token);
        this.mainDataService.ApiImageSlide(this.imageSlideFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getImageSlideList();
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
        this.imageSlideFormGroup.controls['method'].setValue('update');
        this.imageSlideFormGroup.controls['img'].setValue(this.fileBase64);
        this.imageSlideFormGroup.controls['user_id'].setValue(this.token);
        this.mainDataService.ApiImageSlide(this.imageSlideFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getImageSlideList();
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
    Object.keys(this.imageSlideFormGroup.controls).forEach(key => {
      this.imageSlideFormGroup.controls[key].markAsDirty();
      this.imageSlideFormGroup.controls[key].markAsTouched();
      this.imageSlideFormGroup.controls[key].markAsPending();
      const controlErrors: ValidationErrors = this.imageSlideFormGroup.get(key).errors;
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
    this.imageSlideFormGroup.controls['method'].setValue('delete');
    this.imageSlideFormGroup.controls['user_id'].setValue(this.token);
    this.imageSlideFormGroup.controls['id'].setValue(this.itemId);
    this.mainDataService.ApiImageSlide(this.imageSlideFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data.status == 'S') {
          this.alertService.success('success');
          this.localstorageService.removeItem('datasource-local');
          this.getImageSlideList();
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
