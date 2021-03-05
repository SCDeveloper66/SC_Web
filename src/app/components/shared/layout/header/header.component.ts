import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../../../services/global/localstorage.service' // '../../../services/global/localstorage.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMobile: boolean = false;
  currentUser: any;

  constructor(
    private router: Router,
    private authorizationService: AuthorizationService,
    private localStorageService: LocalstorageService
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }

    let sc_platform = this.localStorageService.getLocalStorage('sc_platform');
    if (sc_platform != null && sc_platform == "mobile")
    {
      document.body.classList.remove('fixed-navbar');
      document.body.classList.remove('vertical-layout');      
      this.isMobile = true;
    }else{
      document.body.classList.add('fixed-navbar');
      document.body.classList.add('vertical-layout');
      this.isMobile = false;
    }
      
  }

  ngOnInit(): void {
  }

  profile() {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      this.router.navigate(['/employee/employee-detail', this.currentUser.userCode]);
    }

  }

  logout() {
    this.authorizationService.Logout();
    location.reload();
  }

}
