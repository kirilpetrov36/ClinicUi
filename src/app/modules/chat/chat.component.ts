import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, map, finalize } from 'rxjs/operators';
import { MessageModel } from 'src/app/shared/models/message.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatDataService } from 'src/app/shared/services/chat-date.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SignalrService } from 'src/app/shared/services/signalr.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  public messages: MessageModel[] = [];
  public chatId!: string;
  public userInput: FormControl = this.formBuilder.control('');
  public userId!: string;

  constructor(
    private signalRService: SignalrService,
    public chatDataService: ChatDataService,
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly loaderService: LoaderService
  ) { }

  private readonly unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.loaderService.showLoader();
    
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      if (!!params['id']) {
        if (this.router.url.includes('by-doctor')) {
          this.authService.authData$.pipe(
            map((authData) => {
              if (!!authData && !!authData.token && authData?.userId) {
                this.userId = authData?.userId;
                this.chatDataService.getChatId(authData?.userId, params['id'])
                  .pipe(
                    takeUntil(this.unsubscribe$),
                    map(data => {
                      this.signalRService.connect(data.chatId, authData.token);
                      this.chatId = data.chatId,
                      this.chatDataService.data = data.messages.reverse();
                      this.chatDataService.chatData$.next(this.chatDataService.data);
                    }),
                    finalize(() => this.loaderService.hideLoader())
                  )
                  .subscribe();
              } 
            })
          ).subscribe();
        }
        else{
          
          this.authService.authData$.pipe(
            map((authData) => {
              if (!!authData && !!authData.token && authData?.userId) {
                this.userId = authData?.userId;
                this.chatDataService.getChatId(params['id'], authData?.userId)
                .pipe(
                  takeUntil(this.unsubscribe$),
                  map(data => {
                    this.signalRService.connect(data.chatId, authData.token);
                    this.chatId = data.chatId,
                    this.chatDataService.data = data.messages.reverse();
                    this.chatDataService.chatData$.next(this.chatDataService.data);
                  }),
                  finalize(() => this.loaderService.hideLoader())
                )
                .subscribe();
              } 
            })
          ).subscribe();
        }
      }
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.signalRService.stopHubConnection();
  }

  sendMessage(): void {
    this.signalRService.sendMessage(this.userInput.value, this.chatId);
  }

}
