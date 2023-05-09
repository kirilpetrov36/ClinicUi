import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DayWeekSchedule } from '../models/dayweek-schedule.model';
import { DoctorScheduleModel } from '../models/doctor-schedule.model';
import { ScheduleModel } from '../models/schedule.model';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(
    private readonly http: HttpClient
  ) {
  }

  public getDoctorSchedule(): Observable<DoctorScheduleModel[]> {
    return this.http.get<DoctorScheduleModel[]>(`${environment.apiUrl}/api/schedule/doctor`);
  }

  public getDoctorScheduleByDate(doctorId: string, date: string): Observable<string[]> {
    let params = new HttpParams();
    params = params.append('DoctorId', doctorId);
    params = params.append('Date', date);
    return this.http.get<string[]>(`${environment.apiUrl}/api/schedule/doctor/date`, {params});
  }

  public getAllDoctors(approved: boolean) : Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${environment.apiUrl}/api/user/doctors/${approved}`)
  }

  public createSchedule(model: ScheduleModel): Observable<ScheduleModel> {
    return this.http.post<ScheduleModel>(`${environment.apiUrl}/api/schedule`, model)
  }

  public updateDoctorImage(file: File): Observable<void> {
    const formData = new FormData()
    formData.append('file', file);
    return this.http.put<void>(`${environment.apiUrl}/api/user/image`, formData)
  }

//   public getPatientInfo(id:string): Observable<PatientInfoModel> {
//     return this.http.get<PatientInfoModel>(`${environment.apiUrl}/api/patientInfo/${id}`);
//   }

//   public updatePatientInfo(model: updatePatientInfoModel): Observable<PatientInfoModel> {
//     return this.http.put<PatientInfoModel>(`${environment.apiUrl}/api/patientInfo`, model);
//   }
}
