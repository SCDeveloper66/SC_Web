import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})
export class PagenotfoundComponent implements OnInit {
  currentUser: any;
  constructor(
    private authorizationService: AuthorizationService,
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }
  }

  ngOnInit(): void {
  }

}
