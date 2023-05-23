import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from "@angular/material/snack-bar";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {ChatDataService} from "../../services/chat-date.service";

@Component({
  selector: 'app-my-snackbar',
  templateUrl: './my-snackbar.component.html',
  styleUrls: ['./my-snackbar.component.scss']
})
export class MySnackbarComponent implements OnInit {

  public isImageExist: boolean = false;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private sanitizer:DomSanitizer,
    private router: Router,
    private authService: AuthService,
    public chatDataService: ChatDataService
  ) { }

  ngOnInit(): void {
    if(this.data.imageUrl){
      this.isImageExist = true;
    }
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public openChat(){
    const role = this.authService.getAuthData().role;
    if (role === 'Doctor'){
      this.closeSnackBar();
      this.router.navigate(['/chat/by-doctor', this.data.userId])
    }
    if (role === 'Patient'){
      this.closeSnackBar();
      this.router.navigate(['/chat/by-patient', this.data.userId])
    }
  }

  public closeSnackBar(): void {
    this.data.snackBar.dismiss();
  }
}
