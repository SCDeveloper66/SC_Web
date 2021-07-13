import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { NewsForm } from './news.form';
import { MainDataService } from 'src/app/services/maindata/maindata.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  token;
  currentUser: any;
  topic;
  itemId;
  cols: any[];
  datasource: any[];
  newsFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  public displayModal = false;
  public modalConfirmDelete = false;
  newsTypes: SelectItem[] = [];
  detailData: any;
  psdFile;
  fileBase64;
  public displayVdo = false;
  public displayUrl = false;
  dataVdoUrl;
  dataUrl;
  fileName;
  importFiles: any[] = [];
  fileVideoName;

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
    const expertForm = new NewsForm();
    this.newsFormGroup = this.formBuilder.group(
      expertForm.newsFormBuilder
    );
    const itemForm = new NewsForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.newsFormBuilder
    );
    this.cols = [
      { field: 'number', header: '#', sortable: true },
      { field: 'newsTypeName', header: 'ประเภท', sortable: true },
      { topic: 'topic', header: 'หัวข้อ', sortable: true },
      { topic: 'detail', header: 'รายละเอียด', sortable: true },
      { field: 'action', header: 'Action', sortable: true }
    ];
    this.newsTypes = [
      { value: '1', label: 'ข่าวสาร' },
      { value: '2', label: 'กิจกรรม' },
      { value: '3', label: 'Video' }
    ];
    this.getNewsList();
  }

  get f() { return this.itemFormGroup.controls; }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getNewsList();
  }

  newsTypeChange(event) {
    if (event.value == "3") {
      this.displayVdo = true;
    } else {
      this.displayVdo = false;
    }
  }

  private getNewsList() {
    this.spinner.show();
    this.topic = this.topic == null ? '' : this.topic;
    this.newsFormGroup.controls['method'].setValue('search');
    this.newsFormGroup.controls['topic'].setValue(this.topic);
    this.newsFormGroup.controls['user_id'].setValue(this.token);
    this.mainDataService.ApiNews(this.newsFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          this.detailData = data.newsData;
          let i = 0;
          data.newsData.forEach(element => {
            i++;
            this.datasource.push({
              id: element.id,
              number: i,
              newsTypeId: element.newsTypeId,
              newsTypeName: element.newsTypeName,
              topic: element.topic,
              detail: element.detail,
              url: element.url,
              urlVdo: element.urlVdo,
              vdoFile: element.vdoFile,
              vdoFileUrl: element.vdoFileUrl
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  showModalDialogDetail(id, newsTypeId, topic, detail, url, urlVdo, fileVideoName, fileVideoUrl) {
    this.spinner.show();
    this.psdFile = '';
    this.fileVideoName = fileVideoName;
    if (id == 'ADD') {
      this.itemId = null;
      this.displayUrl = false;
      this.dataUrl = '';
      const itemForm = new NewsForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.newsFormBuilder
      );
      this.displayVdo = false;
      this.displayModal = true;
      this.spinner.hide();
    } else {
      this.itemId = id;
      this.displayUrl = true;
      const itemForm = new NewsForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.newsFormBuilder
      );
      this.itemFormGroup.controls['id'].setValue(id);
      this.itemFormGroup.controls['newsTypeId'].setValue(newsTypeId);
      this.itemFormGroup.controls['topic'].setValue(topic);
      this.itemFormGroup.controls['detail'].setValue(detail);
      this.itemFormGroup.controls['url'].setValue(url);

      this.fileName = topic;
      this.itemFormGroup.controls['urlVdo'].setValue(urlVdo);
      if (newsTypeId == "3") {
        this.displayVdo = true;
        this.dataVdoUrl = urlVdo;
      } else {
        this.displayVdo = false;
      }
      this.dataUrl = newsTypeId == "3" ? fileVideoUrl : url;
      this.displayModal = true;
      this.spinner.hide();
    }
  }

  saveItem() {
    if (this.getFormValidationErrors()) {
      this.spinner.show();
      this.displayModal = false;
      debugger;
      if (this.itemFormGroup.controls['id'].value == '0') {
        this.itemFormGroup.controls['id'].setValue('');
        this.itemFormGroup.controls['method'].setValue('insert');
        if (this.displayVdo == true && this.fileVideoName != null) {
          this.itemFormGroup.controls['img'].setValue(this.fileVideoName);
        } else {
          this.itemFormGroup.controls['img'].setValue(this.fileBase64);
        }
        this.itemFormGroup.controls['user_id'].setValue(this.token);
        this.mainDataService.ApiNews(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getNewsList();
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
        var urlVdo = this.itemFormGroup.controls['urlVdo'].value;
        this.itemFormGroup.controls['method'].setValue('update');
        this.itemFormGroup.controls['url'].setValue(this.dataUrl);
        if (urlVdo == null || urlVdo == '') {
          this.itemFormGroup.controls['urlVdo'].setValue(this.dataVdoUrl);
        }
        if (this.displayVdo == true && this.fileVideoName != null) {
          this.itemFormGroup.controls['img'].setValue(this.fileVideoName);
        } else {
          this.itemFormGroup.controls['img'].setValue(this.fileBase64);
        }
        this.itemFormGroup.controls['user_id'].setValue(this.token);
        this.mainDataService.ApiNews(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getNewsList();
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
    this.fileVideoName = null;
    this.modalConfirmDelete = false;
  }

  deleteItem() {
    this.modalConfirmDelete = false;
    this.spinner.show();
    this.itemFormGroup.controls['method'].setValue('delete');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.itemFormGroup.controls['id'].setValue(this.itemId);
    this.mainDataService.ApiNews(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data.status == 'S') {
          this.alertService.success('success');
          this.localstorageService.removeItem('datasource-local');
          this.getNewsList();
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
    this.dataVdoUrl = '';
    this.dataUrl = '';
    this.fileName = '';
  }

  deleteFile2(opt) {
    if (opt == 1) // ไฟล์รูป
      this.dataUrl = '';
    else if (opt == 2)
      this.dataVdoUrl = '';
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

  upload($event) {
    this.spinner.show();
    const formData = new FormData();
    for (let file of $event.target.files) {
      formData.append(file.name, file);
    }
    this.mainDataService
      .UploadFile(formData, '6', 'Video', this.currentUser.userId)
      .subscribe(
        (next) => {
          debugger;
          if (next.status == 'S') {
            this.fileVideoName = next.value;
            this.alertService.success('Upload Video Success');
          } else {
            this.alertService.error(next.message);
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          this.alertService.error(err);
        });
  }

}
