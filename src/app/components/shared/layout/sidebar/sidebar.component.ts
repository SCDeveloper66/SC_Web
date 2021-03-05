import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { LocalstorageService } from '../../../../services/global/localstorage.service' // '../../../services/global/localstorage.service'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentUser: any;
  public isAcc = false;
  isMobile: boolean = false;
  roleList: Observable<any[]>;

  constructor(
    private authorizationService: AuthorizationService,
    private localStorageService: LocalstorageService
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      if (this.currentUser.userGroup == '4') {
        this.isAcc = true;
      }
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }

    let sc_platform = this.localStorageService.getLocalStorage('sc_platform');
    if (sc_platform != null && sc_platform == "mobile") {
      // document.body.classList.remove('fixed-navbar');
      this.isMobile = true;
    } else {
      // document.body.classList.add('fixed-navbar');
      this.isMobile = false;
    }
    const roleList = JSON.parse(this.currentUser.roleList);
    console.log(roleList);
    this.roleList = Observable.create((a) => {
      a.next(roleList);
    });

  }

  ngOnInit() {
    // $(document).ready(() => {
    //   const layout = $('body').data('lte.layout');
    //   if (layout) {
    //     layout.fix();
    //   }
    //   const trees: any = $('[data-widget="tree"]');
    //   if (trees) {
    //     trees.tree();
    //   }
    // });
  }

}
