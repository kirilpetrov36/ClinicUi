import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageModel } from '../models/message.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ChatIdMessages } from '../models/chatId-messages.model';

@Injectable({
  providedIn: 'root'
})
export class ChatDataService {
    public chatData$: BehaviorSubject<MessageModel[]> = new BehaviorSubject<MessageModel[]>([]);
    public data: MessageModel[] = [];

    constructor(
        private http: HttpClient
        ) { }

    public getDoctorScheduleByDate(chatId: string): Observable<MessageModel[]> {
        let params = new HttpParams();
        params = params.append('ChatId', chatId);
        return this.http.get<MessageModel[]>(`${environment.apiUrl}/api/chat/messages`, {params});
    }

    public getChatId(doctorId:string, patientId:string): Observable<ChatIdMessages> {
        let params = new HttpParams();
        params = params.append('DoctorId', doctorId);
        params = params.append('PatientId', patientId);
        return this.http.get<ChatIdMessages>(`${environment.apiUrl}/api/chat/id`, {params});
    }
}
