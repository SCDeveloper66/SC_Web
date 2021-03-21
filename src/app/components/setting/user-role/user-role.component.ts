import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SelectItem } from 'primeng/api';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { AlertService } from 'src/app/services/global/alert.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { UserRoleService } from 'src/app/services/user-role/user-role.service';
import { UserGroupForm } from './user-group.form';
import { Table } from 'primeng/table';
import { UserRoleForm } from './user-role.form';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {
  token;
  currentUser: any;
  program;
  programs: SelectItem[] = [];
  cols: any[];
  datasource: any[];
  userGroupFormGroup: FormGroup;
  userFormGroup: FormGroup;
  itemFormGroup: FormGroup;
  public displayModal = false;
  public displayUserModal = false;
  usergroup_id;
  programDatasource: any[];
  selectedProgram: any[];
  selectedUser: any[];

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private userRoleService: UserRoleService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    public datepipe: DatePipe,
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
    this.localstorageService.removeItem('programDatasource-local');
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getMasterDDL();
    this.datasource = [];
    const userRoleForm = new UserRoleForm();
    this.userGroupFormGroup = this.formBuilder.group(
      userRoleForm.UserRoleFormBuilder
    );
    const itemForm = new UserRoleForm();
    this.itemFormGroup = this.formBuilder.group(
      itemForm.UserRoleFormBuilder
    );
    this.cols = [
      { field: 'number', header: '#', sortable: true },
      { field: 'userGroup', header: 'กลุ่มผู้ใช้งาน', sortable: true },
      { field: 'active', header: 'สถานะ', sortable: true },
      { field: 'action', header: 'Action', sortable: true }
    ];
    const userForm = new UserRoleForm();
    this.userFormGroup = this.formBuilder.group(
      userForm.UserRoleFormBuilder
    );
  }

  get f() { return this.userGroupFormGroup.controls; }

  private getMasterDDL() {
    const userGroupForm = new UserGroupForm();
    this.itemFormGroup = this.formBuilder.group(
      userGroupForm.UserGroupFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('get_usergroup');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.userRoleService.ApiUserRole(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.datasource = [];
          this.programDatasource = [];
          this.selectedProgram = [];
          let i = 0;
          data.UserGroupList.forEach(element => {
            i++;
            this.datasource.push({
              number: i,
              group_id: element.id,
              userGroup: element.detail,
              active: element.active,
              roleList: element.roleList
            });
          });
          i = 0;
          data.ProgramList.forEach(element => {
            i++;
            this.programDatasource.push({
              program_id: element.id,
              program_name: element.name
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.alertService.error(err);
        this.spinner.hide();
      });
  }

  showModalDialogDetail(usergroup_id, usergroup_Desc, active, roleList) {
    this.spinner.show();
    this.selectedProgram = [];
    this.localstorageService.removeItem('programDatasource-local');
    if (usergroup_id == 'ADD') {
      this.usergroup_id = null;
      const itemForm = new UserRoleForm();
      this.userGroupFormGroup = this.formBuilder.group(
        itemForm.UserRoleFormBuilder
      );
      this.displayModal = true;
      this.spinner.hide();
    } else {
      this.usergroup_id = usergroup_id;
      const itemForm = new UserRoleForm();
      this.userGroupFormGroup = this.formBuilder.group(
        itemForm.UserRoleFormBuilder
      );
      this.userGroupFormGroup.controls['usergroup_id'].setValue(usergroup_id);
      this.userGroupFormGroup.controls['usergroup_Desc'].setValue(usergroup_Desc);
      this.userGroupFormGroup.controls['active'].setValue(active);
      roleList.forEach(element => {
        this.selectedProgram.push({
          program_id: element.program_id,
          program_name: element.program_name
        });
      });
      this.displayModal = true;
      this.spinner.hide();
    }
  }

  showModalDialogUser(usergroup_id, usergroup_Desc, active, roleList) {
    this.displayUserModal = true;
    this.spinner.show();
    this.selectedUser = [];
    this.localstorageService.removeItem('userDatasource-local');

    this.userFormGroup.controls['method'].setValue('get_user');
    this.userFormGroup.controls['usergroup_id'].setValue(usergroup_id);
    this.userRoleService.ApiUserRole(this.userFormGroup.getRawValue()).subscribe(
      (data) => {
        console.log(data);
        if (data.UserList != null) {
          data.UserList.forEach(element => {
            this.selectedUser.push({
              emp_code: element.id,
              emp_name: element.name
            });
          });
        }
        // if (data.status == 'S') {
        //   this.alertService.success('success');
        //   this.localstorageService.removeItem('datasource-local');
        //   this.getMasterDDL();
        // } else {
        //   this.alertService.error(data.message);
        // }
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      }
    );

    // if (usergroup_id == 'ADD') {
    //   this.usergroup_id = null;
    //   const itemForm = new UserRoleForm();
    //   this.userGroupFormGroup = this.formBuilder.group(
    //     itemForm.UserRoleFormBuilder
    //   );
    //   this.displayUserModal = true;
    //   this.spinner.hide();
    // } else {
    //   this.usergroup_id = usergroup_id;
    //   const itemForm = new UserRoleForm();
    //   this.userGroupFormGroup = this.formBuilder.group(
    //     itemForm.UserRoleFormBuilder
    //   );

    //   roleList.forEach(element => {
    //     this.selectedProgram.push({
    //       program_id: element.program_id,
    //       program_name: element.program_name
    //     });
    //   });

    //   this.displayUserModal = true;
    //   this.spinner.hide();
    // }
  }

  saveItem() {
    if (this.getFormValidationErrors()) {
      this.spinner.show();
      this.displayModal = false;
      if (this.userGroupFormGroup.controls['usergroup_id'].value == '0') {
        this.userGroupFormGroup.controls['usergroup_id'].setValue('');
        this.userGroupFormGroup.controls['method'].setValue('save_role');
        this.userGroupFormGroup.controls['user_id'].setValue(this.token);
        this.userGroupFormGroup.controls['program_list'].setValue(this.selectedProgram);
        this.userRoleService.ApiUserRole(this.userGroupFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getMasterDDL();
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
        this.userGroupFormGroup.controls['method'].setValue('save_role');
        this.userGroupFormGroup.controls['user_id'].setValue(this.token);
        this.userGroupFormGroup.controls['program_list'].setValue(this.selectedProgram);
        this.userRoleService.ApiUserRole(this.userGroupFormGroup.getRawValue()).subscribe(
          (data) => {
            if (data.status == 'S') {
              this.alertService.success('success');
              this.localstorageService.removeItem('datasource-local');
              this.getMasterDDL();
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
    Object.keys(this.userGroupFormGroup.controls).forEach(key => {
      this.userGroupFormGroup.controls[key].markAsDirty();
      this.userGroupFormGroup.controls[key].markAsTouched();
      this.userGroupFormGroup.controls[key].markAsPending();
      const controlErrors: ValidationErrors = this.userGroupFormGroup.get(key).errors;
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
