import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from './models/authorization/user.model';
import { AuthorizationService } from './services/authorization/authorization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'standard-can';
  currentUser: User;
  calendarMetting = false;

  constructor(
    private authorizationService: AuthorizationService,
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
    }
    const url = window.location.href;
    if (url.includes('calendar-metting/')) {
      let stringData = url.split('calendar-metting/');
      if (stringData.length > 1) {
        localStorage.setItem('calendar-metting', stringData[1]);
        this.calendarMetting = true;
      }
    }
  }
}
