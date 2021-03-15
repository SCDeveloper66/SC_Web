import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors, FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { MainDataService } from 'src/app/services/maindata/maindata.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { ProjectExcelForm } from './project-excel.form';
import { Table } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project-excel',
  templateUrl: './project-excel.component.html',
  styleUrls: ['./project-excel.component.scss']
})

export class ProjectExcelComponent implements OnInit {

  //baseUrl = "https://jsoft-thailand.com/SCBackendApi/";
  baseUrl = environment.apiUrl;

  token;
  currentUser: any;
  public modalConfirmDelete = false;
  // Aun
  displayFile = false;
  dataUrl;
  fileName;
  itemId;
  cols: any[];
  datasource: any[];
  itemFormGroupX: FormGroup;
  public displayModalX = false;
  projectCourse: SelectItem[] = [];
  projectFormula: SelectItem[] = [];
  projectRoom: SelectItem[] = [];
  public courseErrors = false;
  public formularErrors = false;
  public roomErrors = false;
  public displayID = false;
  public jobID = "";
  public projectCourseId;
  public projectFormulaId;
  public projectRoomId;
  public projectDateFrom;
  public projectDateTo;
  public projectJobID;
  public isDisabled = false;
  public excelFile;
  selectedFile: File;
  disabledText = true;
  fileBase64;

  constructor(
    private authorizationService: AuthorizationService,
    public globalVariableService: GlobalVariableService,
    private mainDataService: MainDataService,
    private formBuilder: FormBuilder,
    private localstorageService: LocalstorageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    public datepipe: DatePipe,
    private http: HttpClient,
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
    const itemForm = new ProjectExcelForm();
    // Aun
    this.itemFormGroupX = this.formBuilder.group(
      itemForm.projectexcelFormBuilder
    );
    // Aun
    this.cols = [
      { field: 'number', header: '#', sortable: true },
      { topic: 'tNo', header: 'เลขที่', sortable: true },
      { topic: 'course_name', header: 'หลักสูตร', sortable: true },
      { topic: 'formula_name', header: 'สูตรคำนวน', sortable: true },
      { topic: 'room_name', header: 'สถานที่อบรม', sortable: true },
      { topic: 'tDate', header: 'วันที่', sortable: true },
      { topic: 'time', header: 'เวลา', sortable: true },
      { field: 'action', header: 'Action', sortable: true }

    ];

    this.getMaster();
    this.getProjectList();

    //this.getBenefitsList();
  }

  // Aun
  get x() {
    if (this.itemFormGroupX.controls['course_id'].value != null) {
      this.courseErrors = false;
    }
    if (this.itemFormGroupX.controls['fomular_id'].value != null) {
      this.formularErrors = false;
    }
    if (this.itemFormGroupX.controls['room_id'].value != null) {
      this.roomErrors = false;
    }
    return this.itemFormGroupX.controls;
  }
  // Aun

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getProjectList();
  }

  showModalDialogDetailX(id, course_id, formula_id, room_id, prj_date, prj_start_time, prj_stop_time, fileName, dataUrl) {
    console.log('showModalDialogDetailX');
    this.spinner.show();
    this.displayID = false;
    //this.psdFile = '';
    if (id == 'ADD') {
      // this.displayUrl = false;
      this.itemId = null;
      const itemForm = new ProjectExcelForm();
      this.itemFormGroupX = this.formBuilder.group(
        itemForm.projectexcelFormBuilder
      );
      let dateNow = new Date();
      this.itemFormGroupX.controls['prj_date'].patchValue(dateNow);
      this.itemFormGroupX.controls['prj_start_time'].patchValue(this.datepipe.transform(dateNow, 'HH:mm'));
      this.itemFormGroupX.controls['prj_stop_time'].patchValue(this.datepipe.transform(dateNow, 'HH:mm'));
      this.displayModalX = true;
      this.displayID = false;
      this.disabledText = false;
      this.spinner.hide();
    } else {
      this.itemId = id;
      const itemForm = new ProjectExcelForm();
      this.itemFormGroupX = this.formBuilder.group(
        itemForm.projectexcelFormBuilder
      );
      this.jobID = id;
      this.itemFormGroupX.controls['job_id'].setValue(id);
      this.itemFormGroupX.controls['course_id'].setValue(this.fnString(course_id));
      this.itemFormGroupX.controls['fomular_id'].setValue(this.fnString(formula_id));
      this.itemFormGroupX.controls['room_id'].setValue(this.fnString(room_id));
      this.itemFormGroupX.controls['prj_date'].patchValue(prj_date);
      this.itemFormGroupX.controls['prj_start_time'].patchValue(prj_start_time);
      this.itemFormGroupX.controls['prj_stop_time'].patchValue(prj_stop_time);

      // this.fileName = "test.xlsx";
      this.dataUrl = dataUrl;
      this.fileName = fileName;
      if (dataUrl != "" && fileName != "") {
        this.displayFile = true;
      } else {
        this.displayFile = false;
      }
      if (typeof prj_date === 'string') {
        let dateNow = new Date();
        let pDate = this.datepipe.transform(dateNow, 'dd/MM/yyyy HH:mm');
        const str = prj_date.split('/');
        let dateX = this.datepipe.transform(str[1] + '/' + str[0] + '/' + str[2] + ' ' + prj_stop_time, 'dd/MM/yyyy HH:mm');

        // convert to a parseable date string:
        var dateStrA = pDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");
        var dateStrB = dateX.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");

        // // now you can compare them using:
        new Date(dateStrA) > new Date(dateStrB) ? this.disabledText = true : this.disabledText = false;

      }

      console.log(this.itemFormGroupX);
      this.displayModalX = true;
      this.displayID = true;
      this.spinner.hide();

    }
  }

  private fnString(s) {
    // if (typeof s != 'string') {
    //   s = "" + s + "";
    // }

    s = s == null ? '' : s != typeof 'string' ? "" + s + "" : s

    return s;
  }

  getMaster() {
    this.spinner.show();
    let body = {
      "method": "proexc_master",
      "user_id": this.token
    }

    const onSuccess = (data) => {
      console.log("call api master sucess");
      console.log(data);

      this.projectCourse = [];
      this.projectFormula = [];
      this.projectRoom = [];

      data.course.forEach(m => {
        this.projectCourse.push({ value: m.code, label: m.text });
      });
      data.fomular.forEach(m => {
        this.projectFormula.push({ value: m.code, label: m.text });
      });
      data.room.forEach(m => {
        this.projectRoom.push({ value: m.code, label: m.text });
      });

      this.spinner.hide();
    }

    this.ApiProjectExcel(body).subscribe(data => onSuccess(data), error => {
      this.spinner.hide();
      console.log(error);
      alert('Can\'t call web api.' + ' : ' + error.message);
    })
  }

  saveItemProject() {
    if (this.FormValidationErrors()) {
      //debugger;
      this.spinner.show();
      console.log("saveItemProject");
      console.log(this.itemFormGroupX);

      if (this.itemFormGroupX.controls['job_id'].value == '0') {

        this.itemFormGroupX.controls['job_id'].setValue('');
        this.itemFormGroupX.controls['method'].setValue('proexc_submit');
        this.itemFormGroupX.controls['user_id'].setValue(this.token);


        let prj_date = '';
        if ((typeof this.itemFormGroupX.controls['prj_date'].value === 'string')
          && (this.itemFormGroupX.controls['prj_date'].value.indexOf('/') > -1)) {
          const str = this.itemFormGroupX.controls['prj_date'].value.split('/');
          let year = Number(str[2]);
          const month = Number(str[1]) - 1;
          const date = Number(str[0]);
          let newStartDate = new Date(year, month, date);
          prj_date = this.datepipe.transform(newStartDate, 'dd/MM/yyyy');
        } else {
          prj_date = this.datepipe.transform(this.itemFormGroupX.controls['prj_date'].value, 'dd/MM/yyyy');
        }

        this.itemFormGroupX.controls['prj_date'].patchValue(prj_date);

        console.log(this.itemFormGroupX.getRawValue());

        const onSuccess = (data) => {

          if (data.status == 'S') {
            this.alertService.success('success');
            this.localstorageService.removeItem('datasource-local');
            console.log(data);

            this.itemFormGroupX.controls['job_id'].setValue(data.value);
            this.jobID = data.value;
            this.displayID = true;
            this.displayModalX = true;
            this.getProjectList();
          } else {
            this.alertService.error(data.message);
          }

          this.spinner.hide();
        }
        this.ApiProjectExcel(this.itemFormGroupX.getRawValue()).subscribe(data => onSuccess(data), error => {
          this.spinner.hide();
          console.log(error);
          this.alertService.error(error);
        })

      } else {
        this.itemFormGroupX.controls['job_id'].setValue(this.jobID);
        this.itemFormGroupX.controls['method'].setValue('proexc_submit');
        this.itemFormGroupX.controls['user_id'].setValue(this.token);


        let prj_date = '';
        if ((typeof this.itemFormGroupX.controls['prj_date'].value === 'string')
          && (this.itemFormGroupX.controls['prj_date'].value.indexOf('/') > -1)) {
          const str = this.itemFormGroupX.controls['prj_date'].value.split('/');
          let year = Number(str[2]);
          const month = Number(str[1]) - 1;
          const date = Number(str[0]);
          let newStartDate = new Date(year, month, date);
          prj_date = this.datepipe.transform(newStartDate, 'dd/MM/yyyy');
        } else {
          prj_date = this.datepipe.transform(this.itemFormGroupX.controls['prj_date'].value, 'dd/MM/yyyy');
        }

        this.itemFormGroupX.controls['prj_date'].patchValue(prj_date);

        console.log(this.itemFormGroupX.getRawValue());

        const onSuccess = (data) => {

          if (data.status == 'S') {
            this.alertService.success('success');
            this.localstorageService.removeItem('datasource-local');
            console.log(data);

            this.itemFormGroupX.controls['job_id'].setValue(data.value);
            this.jobID = data.value;
            this.displayID = true;
            this.displayModalX = false;
            this.getProjectList();
          } else {
            this.alertService.error(data.message);
          }

          this.spinner.hide();
        }
        this.ApiProjectExcel(this.itemFormGroupX.getRawValue()).subscribe(data => onSuccess(data), error => {
          this.spinner.hide();
          console.log(error);
          this.alertService.error(error);
        })

      }

    } else {
      return false;
    }
  }

  FormValidationErrors() {
    //debugger;
    let valid = true;
    Object.keys(this.itemFormGroupX.controls).forEach(key => {
      this.itemFormGroupX.controls[key].markAsDirty();
      this.itemFormGroupX.controls[key].markAsTouched();
      this.itemFormGroupX.controls[key].markAsPending();
      const controlErrors: ValidationErrors = this.itemFormGroupX.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
        valid = false;
      }
    });
    if (this.itemFormGroupX.controls['course_id'].value == null) {
      this.courseErrors = true;
    }
    if (this.itemFormGroupX.controls['fomular_id'].value == null) {
      this.formularErrors = true;
    }
    if (this.itemFormGroupX.controls['room_id'].value == null) {
      this.roomErrors = true;
    }

    if (this.itemFormGroupX.controls['prj_start_time'].value != '') {
      let start_time = this.itemFormGroupX.controls['prj_start_time'].value;
      let timeFrom = Number(start_time.substring(0, 2));
      let stop_time = this.itemFormGroupX.controls['prj_stop_time'].value;
      let timeTo = Number(stop_time.substring(0, 2));
      if (timeFrom > timeTo) {
        this.alertService.warning('เวลา ไม่ถูกต้อง');
        valid = false;
      }
    }
    return valid;
  }

  upload() {

    if (this.fileBase64) {


      let body = {
        "method": "proexc_import",
        "user_id": this.token,
        "job_id": this.jobID,
        "excel_base64": this.fileBase64
      }
      console.log(body);
      //debugger;
      this.spinner.show();
      // const formData = new FormData();
      // formData.append(this.selectedFile.name, this.selectedFile);
      // console.log(this.selectedFile.name)

      const onSuccess = (data) => {
        debugger;
        console.log(data);
        if (data.status == 'S') {
          this.dataUrl = data.value2;
          this.fileName = data.value //this.selectedFile.name;
          this.displayFile = true;
          this.alertService.success('success');
          this.getProjectList();
        } else {
          this.alertService.error(data.message);
        }
        this.spinner.hide();
      }
      this.ApiProjectExcel(body).subscribe(data => onSuccess(data), error => {
        this.spinner.hide();
        console.log(error);
        this.alertService.error(error);
      })
      // this.UploadFile(formData, 'proexc_import', this.jobID, this.token).subscribe(data => onSuccess(data), error => {
      //   this.spinner.hide();
      //   console.log(error);
      //   this.alertService.error(error);
      // })
    } else {
      this.alertService.warning('กรุณาเลือกไฟล์ก่อนทำการ import');
    }

  }

  changeListener($event): void {
    // this.selectedFile = <File>$event.target.files[0]
    // console.log($event)
    // console.log(this.selectedFile)
    this.readThis($event.target);
    this.deleteFile();
  }

  UploadFile(formData: FormData, method, job_id, user_id) {

    return this.http.post<any>(this.baseUrl + 'api/Project/', formData, {
      params: {
        method,
        user_id,
        job_id
      }
    });
  }

  export() {
    // if (this.dataUrl != "") {
    //   window.open(this.dataUrl);
    // } else {

    let body = {
      "method": "proexc_export",
      "user_id": this.token,
      "job_id": this.jobID
    }

    this.spinner.show();
    const onSuccess = (data) => {
      if (data.status == 'S') {
        console.log('export sucess');
        console.log(data);
        window.open(data.value);
        this.displayModalX = true;
      } else {
        this.alertService.error(data.message);
      }
      this.spinner.hide();
    }
    this.ApiProjectExcel(body).subscribe(data => onSuccess(data), error => {
      this.spinner.hide();
      console.log(error);
      this.alertService.error(error);
    })
    // }
  }

  getProjectList() {

    //debugger;
    this.spinner.show();

    let dateForm = this.projectDateFrom == null ? '' : this.datepipe.transform(this.projectDateFrom, 'dd/MM/yyyy');
    let dateTo = this.projectDateTo == null ? '' : this.datepipe.transform(this.projectDateTo, 'dd/MM/yyyy');

    this.projectCourseId = this.projectCourseId == null ? '' : this.projectCourseId;
    this.projectFormulaId = this.projectFormulaId == null ? '' : this.projectFormulaId;
    this.projectRoomId = this.projectRoomId == null ? '' : this.projectRoomId;
    this.projectJobID = this.projectJobID == null ? '' : this.projectJobID;

    let body = {
      "method": "proexc_search",
      "user_id": this.token,
      "job_id": this.projectJobID,
      "course_id": this.projectCourseId,
      "formula_id": this.projectFormulaId,
      "room_id": this.projectRoomId,
      "prj_date_from": dateForm,
      "prj_date_to": dateTo,
    }

    const onSuccess = (data) => {
      if (data) {
        console.log(data);
        this.datasource = [];
        // this.detailData = data;
        let i = 0;
        data.forEach(element => {
          i++;
          this.datasource.push({
            tNo: element.tNo,
            number: i,
            course_id: element.course_id,
            course_name: element.course_name,
            formula_id: element.formula_id,
            formula_name: element.formula_name,
            room_id: element.room_id,
            room_name: element.room_name,
            tDate: element.tDate,
            time: element.tTimeStart + " - " + element.tTimeStop,
            tTimeStart: element.tTimeStart,
            tTimeStop: element.tTimeStop,
            fileName: element.data1,
            dataUrl: element.data2,
          });
        });
      }
      this.spinner.hide();

    }
    this.ApiProjectExcel(body).subscribe(data => onSuccess(data), error => {
      this.spinner.hide();
      console.log(error);
      this.alertService.error(error);
    })

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

    let body = {
      "method": "proexc_delete",
      "user_id": this.token,
      "job_id": this.itemId
    }

    const onSuccess = (data) => {

      console.log(data);
      if (data.status == 'S') {
        this.alertService.success('success');
        //this.localstorageService.removeItem('datasource-local');
        this.getProjectList();
      } else {
        this.alertService.error(data.message);
      }
      this.spinner.hide();
    }

    this.ApiProjectExcel(body).subscribe(data => onSuccess(data), error => {
      this.spinner.hide();
      console.log(error);
      this.alertService.error(error);
    })

  }

  deleteFile() {
    this.dataUrl = '';
    this.fileName = '';
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.fileBase64 = myReader.result;
      this.selectedFile = file;
    };
    myReader.readAsDataURL(file);
    console.log(file);
  }

  ApiProjectExcel(body: any) {

    return this.http.post<any>(this.baseUrl + 'api/Project/', body);
  }
  // Aun



}
