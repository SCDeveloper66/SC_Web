import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthorizationService } from '../services/authorization/authorization.service';
import { AlertService } from '../services/global/alert.service';
import { LocalstorageService } from '../services/global/localstorage.service';

@Injectable({ providedIn: 'root' })
export class RouteGuard implements CanActivate {
  isAdmin: boolean = false;
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
      return true;
    } else {
      return false;
    }
  }
}
