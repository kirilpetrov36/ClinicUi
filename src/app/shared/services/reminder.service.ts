import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateUserReminderModel } from '../models/create-user-reminder.model';
import { ReadUserReminderModel } from '../models/read-user-reminder.models';
import { UpdateUserRemindersModel } from '../models/update-user-reminder.model';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  constructor(
    private readonly http: HttpClient
  ) {
  }

  public createUserReminder(model: CreateUserReminderModel): Observable<string>{
    return this.http.post<string>(`${environment.apiUrl}/api/reminders`, model);
  }

  public getUserReminders(userId: string): Observable<ReadUserReminderModel>{
    let params = new HttpParams;
    params = params.append('userId', userId);
    return this.http.get<ReadUserReminderModel>(`${environment.apiUrl}/api/reminders`, {params});
  }

  public updateUserReminders(model: UpdateUserRemindersModel): Observable<void>{
    return this.http.put<void>(`${environment.apiUrl}/api/reminders`, model);
  }

  public deleteUserReminder(id: string): Observable<void>{
    let params = new HttpParams;
    params = params.append('userReminderId', id);
    return this.http.delete<void>(`${environment.apiUrl}/api/reminders`, {params});
  }
}
