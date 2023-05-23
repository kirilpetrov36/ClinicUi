import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {JwtPayload} from '../models/jwt-payload';
import { SignUpModel } from '../models/sign-up.model';
import {DoctorTypeModel} from "../models/doctor-type.model";

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
    const formData = new FormData();
    formData.append('email', signUpModel.email);
    formData.append('password', signUpModel.password);
    formData.append('firstName', signUpModel.firstName);
    formData.append('lastName', signUpModel.lastName);
    formData.append('role', signUpModel.role);
    formData.append('image', signUpModel.image);
    formData.append('doctorTypeId', signUpModel.doctorTypeId);
    return this.http.post<JwtPayload>(`${environment.apiUrl}/api/auth/register`, formData)
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

  public approveDoctor(doctorId: string, value: boolean): Observable<void>{
    return this.http.get<void>(`${environment.apiUrl}/api/user/approve/${doctorId}/${value}`);
  }

  public addDoctorType(name: string): Observable<void>{
    let params = new HttpParams()
    params = params.append('name', name);
    return this.http.post<void>(`${environment.apiUrl}/api/user/add-doctor-type`, { params });
  }

  public updateTypes(types: DoctorTypeModel[]): Observable<void>{
    return this.http.put<void>(`${environment.apiUrl}/api/user/update-types`, types);
  }

  public getAllTypes(): Observable<DoctorTypeModel[]>{
    return this.http.get<DoctorTypeModel[]>(`${environment.apiUrl}/api/user/types`);
  }

  public getAllChats(): Observable<string[]>{
    return this.http.get<string[]>(`${environment.apiUrl}/api/user/chat-ids`)
  }

}
