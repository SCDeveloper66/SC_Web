import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../../../services/global/localstorage.service' // '../../../services/global/localstorage.service'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMobile: boolean = false;
  currentUser: any;
  siteLanguage: string = 'th';
  siteLocale: string;
  languageList = [
    { code: 'en', label: 'English', flag: 'us' },
    { code: 'th', label: 'Thailand', flag: 'th' }
  ];

  constructor(
    private router: Router,
    private authorizationService: AuthorizationService,
    private localStorageService: LocalstorageService,
    private translate: TranslateService
  ) {
    debugger;
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      let langCode = this.localStorageService.getLocalStorage('language');
      if (langCode == null) {
        this.authorizationService.LanguagesChange(this.siteLanguage);
        langCode = this.siteLanguage;
      } else {
        this.siteLanguage = langCode;
      }
      this.siteLocale = this.languageList.find(f => f.code === langCode).flag;
      this.translate = translate;
      this.translate.setDefaultLang(this.siteLanguage);
    } else {
      this.authorizationService.Logout();
      location.reload(true);
    }

    let sc_platform = this.localStorageService.getLocalStorage('sc_platform');
    if (sc_platform != null && sc_platform == "mobile") {
      document.body.classList.remove('fixed-navbar');
      document.body.classList.remove('vertical-layout');
      this.isMobile = true;
    } else {
      document.body.classList.add('fixed-navbar');
      document.body.classList.add('vertical-layout');
      this.isMobile = false;
    }

  }

  ngOnInit(): void {
  }

  funcLanguage(langCode) {
    this.siteLanguage = this.languageList.find(f => f.code === langCode).code;
    this.siteLocale = this.languageList.find(f => f.code === langCode).flag;
    this.localStorageService.setLocalStorage('language', this.siteLanguage);
    this.translate.use(langCode);
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
