import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { LocalstorageService } from 'src/app/services/global/localstorage.service';
declare var initailData: any;
declare var TnsdGetMaster: any;

@Component({
  selector: 'app-training-schedule-detail',
  templateUrl: './training-schedule-detail.component.html',
  styleUrls: ['./training-schedule-detail.component.scss']
})
export class TrainingScheduleDetailComponent implements OnInit {
  token;
  currentUser: any;
  method;
  dataId;

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router,
    private route: ActivatedRoute,
    private localstorageService: LocalstorageService,
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      const token = JSON.parse(this.localstorageService.getLocalStorage('tokenStandardCan'));
      this.token = token;
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.method = 'detail';
      this.dataId = id;
    }
    else {
      this.method = 'create';
      this.dataId = '';
    }
    new initailData(this.method, this.dataId);
    new TnsdGetMaster();
  }

}
