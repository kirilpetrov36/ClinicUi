import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {AuthService} from 'src/app/shared/services/auth.service';
import {catchError, switchMap} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private readonly authService: AuthService
  ) {
  }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('auth')) {
      return next.handle(request);
    }

    return this.processRequestWithToken(request, next).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.authService.refreshToken()
          .pipe(
            switchMap(() => this.processRequestWithToken(request, next)),
            catchError(error => {
              this.authService.logout();

              return throwError(error);
            })
          );
      }

      return throwError(error);
    }));
  }

  private processRequestWithToken(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (!!token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
