import {Component, OnDestroy, OnInit} from '@angular/core';
import {SignalrService} from "./shared/services/signalr.service";
import {AuthService} from "./shared/services/auth.service";
import {Subject} from "rxjs";
import {map, takeUntil} from "rxjs/operators";
import {ChatDataService} from "./shared/services/chat-date.service";
import {MySnackBarService} from "./shared/services/my-snackbar.service";
import {PatientInfoModel} from "./shared/models/patient-info.model";
import {PatientInfoService} from "./shared/services/patient-info.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  title = 'ClinicUI';
  private readonly unsubscribe$ = new Subject<void>();
  public patientInfoModel!: PatientInfoModel;

  constructor(
    private readonly signalrService: SignalrService,
    private readonly authService: AuthService,
    public chatDataService: ChatDataService,
    private snack: MySnackBarService,
    private readonly patientInfoService: PatientInfoService
  )
  {
  }

  ngOnInit(): void {
    this.authService.authData$
      .pipe(
        takeUntil(this.unsubscribe$),
        map(authData => {
          if (!!authData && !!authData.token) {
            this.authService.getAllChats()
              .pipe(
                takeUntil(this.unsubscribe$),
                map(
                  data => {
                    data.forEach(chatId => {
                      this.signalrService.connect(chatId, authData.token);
                    });
                  }
                )
              )
              .subscribe()
          }
        })
      )
      .subscribe()

    this.chatDataService.chatData$
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe(
        () => {
          this.patientInfoService.getPatientInfo(this.chatDataService.newMessage.userId)
            .pipe(
              takeUntil(this.unsubscribe$),
              map(patientData => {
                this.snack.openSnackBar(
                  this.chatDataService.newMessage.text,
                  this.chatDataService.newMessage.userId,
                  patientData.firstName + ' ' + patientData.lastName,
                  patientData.imageUrl)
              })
            )
            .subscribe()
        }
      )
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.signalrService.stopHubConnection();
    console.log("connection stopped")
  }
}
