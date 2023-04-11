import { Injectable } from '@angular/core';  
import { MessageModel } from '../models/message.model';
import * as signalR from "@microsoft/signalr"
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatDataService } from './chat-date.service';
import { HttpClient } from '@angular/common/http';
import { SendMessageModel } from '../models/send-message.mode';

  
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
      
  private hubConnection!: signalR.HubConnection;

  constructor(
    private chatDataService: ChatDataService,
    private http: HttpClient
    ) { }

  public connect = (chatId: string, jwtToken: string) => {
    this.startConnection(jwtToken, chatId);
    // this.addToGroup(chatId);
    this.addListeners();
  }

  public sendMessage(text: string, chatId: string) {
    
    var promise = this.hubConnection.invoke("SendMessage", this.buildChatMessage(text, chatId))
      .then(() => { console.log('message sent successfully to hub'); })
      .catch((err) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }

  private getConnection(jwtToken: string, chatId: string): signalR.HubConnection {
    return new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/MessageHub?chatId=${chatId}`, {
        accessTokenFactory: () => jwtToken
      })
      .build();
  }

  private buildChatMessage(text: string, chatId: string): SendMessageModel {
    return {
      text: text,
      chatId: chatId
    };
  }

  private startConnection(jwtToken: string, chatId: string) {
    this.hubConnection = this.getConnection(jwtToken, chatId);

    this.hubConnection.start()
      .then(() => console.log('connection started'))
      .catch((err) => console.log('error while establishing signalr connection: ' + err))
  }

  private addListeners() {
    this.hubConnection.on("messagereceived", (data: MessageModel) => {
      console.log("message received from Hub")
      this.chatDataService.data.unshift(data);
      this.chatDataService.chatData$.next(this.chatDataService.data);
    });
    this.hubConnection.on("newUserConnected", _ => {
      console.log("new user connected")
    });
  }

  public stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}  