import {BehaviorSubject, Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ShowChatNotificationsService{

  public readonly showChatNotificationSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public readonly showChatNotification$: Observable<boolean> = this.showChatNotificationSubject.asObservable();

  public showChatNotification(): void {
    this.showChatNotificationSubject.next(true);
    console.log("show");
  }

  public hideChatNotification(): void {
    this.showChatNotificationSubject.next(false);
    console.log("hide");
  }
}
