import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthorizationService } from '../services/authorization/authorization.service';
import { AlertService } from '../services/global/alert.service';
import { LocalstorageService } from '../services/global/localstorage.service';

@Injectable({ providedIn: 'root' })
export class RouteGuardAcc implements CanActivate {
  isAcc: boolean = false;
  currentUser: any;

  constructor(
    private router: Router,
    private authorizationService: AuthorizationService,
    private alertService: AlertService,
    private localStorageService: LocalstorageService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if (this.authorizationService.currentUserValue) {
      this.currentUser = this.authorizationService.currentUserValue;
      if (this.currentUser.userGroup == '4') {
        this.isAcc = true;
      }
    }
    return this.isAcc;
  }
}
