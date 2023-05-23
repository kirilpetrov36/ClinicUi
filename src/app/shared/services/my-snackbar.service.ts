import {Injectable, OnDestroy, OnInit} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MySnackbarComponent } from '../components/my-snackbar/my-snackbar.component';
import {take, takeUntil} from "rxjs/operators";
import { Subject} from "rxjs";
import {ShowChatNotificationsService} from "./show-chat-notifications.service";

@Injectable({
  providedIn: 'root'
})
export class MySnackBarService implements OnDestroy{

  private unsubscribe$ = new Subject<void>();

  constructor(
    private snackBar: MatSnackBar,
    private showChatNotificationService: ShowChatNotificationsService
  ) {}

  public openSnackBar(message: string, userId: string, author: string, imageUrl: string) {
    this.showChatNotificationService.showChatNotification$.pipe(take(1))
      .subscribe(data => {
        if (data){
          this.snackBar.openFromComponent(MySnackbarComponent, {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            data: {
              message: message,
              userId: userId,
              author: author,
              imageUrl: imageUrl,
              snackBar: this.snackBar
            }
          });
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
