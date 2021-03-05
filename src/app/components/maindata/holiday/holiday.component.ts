import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { SelectItem } from 'primeng/api';
import { GlobalVariableService } from 'src/app/services/global/global-variable.service';
import { MainDataService } from 'src/app/services/maindata/maindata.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/global/alert.service';
import { HolidayForm } from './holiday.form';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export class HolidayComponent implements OnInit {
  token;
  currentUser: any;
  holiday;
  holidays: SelectItem[] = [];
  cols: any[];
  datasource: any[];
  holidayFormGroup: FormGroup;
  itemFormGroup: FormGroup;

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
    this.getMasterDDL();
    this.cols = [
      { field: 'no', header: '#', sortable: true },
      { field: 'date', header: 'วันที่', sortable: true },
      { field: 'name', header: 'วันหยุด', sortable: true },
    ];
    const holidayForm = new HolidayForm();
    this.holidayFormGroup = this.formBuilder.group(
      holidayForm.HolidayFormBuilder
    );
  }

  private getMasterDDL() {
    const holidayForm = new HolidayForm();
    this.itemFormGroup = this.formBuilder.group(
      holidayForm.HolidayFormBuilder
    );
    this.itemFormGroup.controls['method'].setValue('master');
    this.itemFormGroup.controls['user_id'].setValue(this.token);
    this.mainDataService.ApiHoliday(this.itemFormGroup.getRawValue()).subscribe(
      (data) => {
        if (data) {
          this.holidays = [];
          data.year.forEach(m => {
            this.holiday = m.code;
            this.holidays.push({ value: m.code, label: m.text });
          });
          this.getHolidayList();
        }
        this.spinner.hide();
      }, (err) => {
        this.alertService.error(err);
        this.spinner.hide();
      });
  }

  search(dt: Table) {
    this.localstorageService.removeItem('datasource-local');
    this.getHolidayList();
  }

  private getHolidayList() {
    this.spinner.show();
    this.holiday = this.holiday == null ? '' : this.holiday;
    this.holidayFormGroup.controls['method'].setValue('search');
    this.holidayFormGroup.controls['year'].setValue(this.holiday);
    this.holidayFormGroup.controls['user_id'].setValue(this.token);
    this.mainDataService.ApiHoliday(this.holidayFormGroup.getRawValue()).subscribe(
      (data) => {
        this.datasource = [];
        if (data) {
          let i = 0;
          data.forEach(element => {
            i++;
            this.datasource.push({
              number: i,
              id: element.id,
              date: element.date,
              name: element.name
            });
          });
        }
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.alertService.error(err);
      });
  }

}
