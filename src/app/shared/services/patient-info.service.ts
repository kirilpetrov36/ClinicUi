import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DayWeekSchedule } from '../models/dayweek-schedule.model';
import { PatientInfoModel } from '../models/patient-info.model';
import { PatientScheduleModel } from '../models/patient-schedule.model';
import { updatePatientInfoModel } from '../models/update-patient-info.model';
import {PatientSomeInfoModel} from "../models/patient-some-info.model";

@Injectable({
  providedIn: 'root'
})
export class PatientInfoService {

  constructor(
    private readonly http: HttpClient
  ) {
  }

  public getCurrentPatientInfo(): Observable<PatientInfoModel> {
    return this.http.get<PatientInfoModel>(`${environment.apiUrl}/api/patientInfo/me`);
  }

  public getPatientInfo(id:string): Observable<PatientInfoModel> {
    return this.http.get<PatientInfoModel>(`${environment.apiUrl}/api/patientInfo/${id}`);
  }

  public createPatientInfo(model: updatePatientInfoModel): Observable<PatientInfoModel> {
    return this.http.post<PatientInfoModel>(`${environment.apiUrl}/api/patientInfo`, model);
  }

  public updatePatientInfo(model: updatePatientInfoModel): Observable<PatientInfoModel> {
    return this.http.put<PatientInfoModel>(`${environment.apiUrl}/api/patientInfo`, model);
  }

  public getPatientSchedule(): Observable<DayWeekSchedule<PatientScheduleModel>[]> {
    return this.http.get<DayWeekSchedule<PatientScheduleModel>[]>(`${environment.apiUrl}/api/schedule/patient`);
  }

  public getPatientDiagnosis(patientId: string): Observable<PatientSomeInfoModel[]>{
    var params = new HttpParams();
    params = params.append("PatientId", patientId);
    return this.http.get<PatientSomeInfoModel[]>(`${environment.apiUrl}/api/patientInfo/diangosis`, {params})
  }

  public getPatientAnalyses(patientId: string): Observable<PatientSomeInfoModel[]>{
    var params = new HttpParams();
    params = params.append("PatientId", patientId);
    return this.http.get<PatientSomeInfoModel[]>(`${environment.apiUrl}/api/patientInfo/analyses`, {params})
  }
  public getPatientTreatments(patientId: string): Observable<PatientSomeInfoModel[]>{
    var params = new HttpParams();
    params = params.append("PatientId", patientId);
    return this.http.get<PatientSomeInfoModel[]>(`${environment.apiUrl}/api/patientInfo/treatment`, {params})
  }

}
