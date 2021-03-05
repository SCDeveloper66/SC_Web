import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { MainDataService } from 'src/app/services/maindata/maindata.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { NodeForm } from './node.form';


@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
  token;
  currentUser: any;
  itemId;
  cols: any[];
  datasource: any[];
  nodeFormGroup: FormGroup;
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
    this.spinner.show();
    this.datasource = [];
    this.cols = [
      { field: 'number', header: '#', sortable: true },
      { field: 'ip', header: 'IP', sortable: true },
      { field: 'name', header: 'ชื่อ', sortable: true },
      { field: 'ref_id', header: 'เลขอ้างอิง', sortable: true },
      { field: 'action', header: 'Action', sortable: true }
    ];
    const nodeForm = new NodeForm();
    this.nodeFormGroup = this.formBuilder.group(
      nodeForm.NodeFormBuilder
    );
    const itemForm = new NodeForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.NodeFormBuilder
    );
    this.getNodeList();
  }

  get f() { return this.itemFormGroup.controls; }

  private getNodeList() {
    this.localstorageService.removeItem('datasource-local');
    this.spinner.show();
    this.nodeFormGroup.controls['method'].setValue('search');
    this.nodeFormGroup.controls['user_id'].setValue(this.token);
    this.mainDataService.ApiNode(this.nodeFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          let i = 0;
          data.forEach(element => {
            i++;
            this.datasource.push({
              number: i,
              id: element.id,
              ip: element.ip,
              name: element.name,
              ref_id: element.ref_id,
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

  showModalDialogDetail(id, ip, name, ref_id) {
    this.spinner.show();
    if (id == 'ADD') {
      this.itemId = null;
      const itemForm = new NodeForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.NodeFormBuilder
      );
      this.displayModal = true;
      this.spinner.hide();
    } else {
      this.itemId = id;
      const itemForm = new NodeForm();
      this.itemFormGroup = this.formBuilder.group(
        itemForm.NodeFormBuilder
      );
      this.itemFormGroup.controls['id'].setValue(id);
      this.itemFormGroup.controls['ip'].setValue(ip);
      this.itemFormGroup.controls['name'].setValue(name);
      this.itemFormGroup.controls['ref_id'].setValue(ref_id);
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
        this.mainDataService.ApiNode(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getNodeList();
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
        this.mainDataService.ApiNode(this.itemFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getNodeList();
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
    this.mainDataService.ApiNode(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data.status == 'S') {
          this.alertService.success('success');
          this.localstorageService.removeItem('datasource-local');
          this.getNodeList();
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
