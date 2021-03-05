import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthorizationService } from '../services/authorization/authorization.service';

@Injectable()
export class ErrorInterceptor2 implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request);
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthorizationService,
    private router: Router,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      let error = err.statusText;
      if (err.status === 0) {
        if (err.statusText == 'Unknown Error') {
          error = err.name;
        } else {
          error = err.statusText;
        }
      } else if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.Logout();
        location.reload(true);
      } else if (err.status === 500) {
        error = err.error;
      }
      if (error == 'Page Not Found.') {
        this.router.navigate(['/pagenotfound']);
      }
      return throwError(error);
    }));
  }
}
