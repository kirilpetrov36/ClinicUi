import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {JwtPayload} from '../models/jwt-payload';
import { SignUpModel } from '../models/sign-up.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authDataKey = 'authData';

  private readonly authDataSubject: BehaviorSubject<JwtPayload> = new BehaviorSubject(
    JSON.parse(localStorage.getItem(this.authDataKey) ?? '{}')
  );

  public readonly authData$: Observable<JwtPayload> = this.authDataSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
  }

  public login(email: string, password: string): Observable<void> {
    const model = {
      email,
      password
    };

    return this.http.post<JwtPayload>(`${environment.apiUrl}/api/auth/login`, model)
      .pipe(map(response => {
        localStorage.setItem(this.authDataKey, JSON.stringify(response));

        this.authDataSubject.next(response);
      }));
  }

  public register(signUpModel: SignUpModel): Observable<void> {
    return this.http.post<JwtPayload>(`${environment.apiUrl}/api/auth/register`, signUpModel)
      .pipe(map(response => {
        localStorage.setItem(this.authDataKey, JSON.stringify(response));

        this.authDataSubject.next(response);
      }));
  }

  public refreshToken(): Observable<void> {
    const authData = this.getAuthData();

    const model = {
      refreshToken: authData.refreshToken
    };

    return this.http.post<JwtPayload>(`${environment.apiUrl}/api/auth/refresh`, model)
      .pipe(map(response => {
        localStorage.setItem(this.authDataKey, JSON.stringify(response));

        this.authDataSubject.next(response);
      }));
  }

  public logout(): void {
    this.authDataSubject.next({} as unknown as JwtPayload);

    localStorage.removeItem(this.authDataKey);

    this.router.navigate(['sign-in']);
  }

  public getToken(): string {
    return this.authDataSubject.value?.token;
  }

  public getAuthData(): JwtPayload {
    return this.authDataSubject.value;
  }
}
