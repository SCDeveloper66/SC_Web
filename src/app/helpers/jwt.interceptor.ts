import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { AuthorizationService } from '../services/authorization/authorization.service';
import { LocalstorageService } from '../services/global/localstorage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthorizationService,
    private localStorageService: LocalstorageService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      const token = JSON.parse(this.localStorageService.getLocalStorage('tokenStandardCan'));
      const decodeToken = jwt_decode(token);
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ` + token
        }
      });
    }
    return next.handle(request);
  }
}
