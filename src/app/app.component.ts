import { Component, OnChanges, AfterViewChecked, OnInit } from '@angular/core';
import { LoginService, IAuthCredential } from './services/login.service';
import { Router } from '@angular/router';
import { LoggerService } from './services/logger.service';
import { MapService } from './services/map.service';
import { IUser } from './templates/template';
import { MatSnackBar, MatSnackBarConfig } from "@angular/material";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private mapService: MapService,
    private router: Router,
    private log: LoggerService,
    public snackBar: MatSnackBar
  ) { }

  public isLogin: Boolean = false;
  public user: IAuthCredential = {
    id: '',
    name: '',
    isAnonymous: false,
    imageUrl: ''
  };
  // public isAnonymous: Boolean = false;
  // public userName: string;
  public title = 'PosmApp';

  ngOnInit() {
    this.loginService.loginSubject.subscribe((auth) => {
      this.log.info(auth, 'Login');
      this.isLogin = Boolean(auth.id);
      if(this.isLogin) {
        this.user.isAnonymous = auth.isAnonymous;
        this.user.imageUrl = auth.imageUrl;
        this.router.navigateByUrl('/projects');
      } else {
        this.setUserName('');
        this.user.isAnonymous = false;
        this.user.imageUrl = '';
        this.router.navigateByUrl('/login');
      }
    });
    this.mapService.userSubject.subscribe({
      next: (user: IUser) => { this.setUserName(user.name); }
    })
  }

  logout() {
    this.loginService.logout();
  }

  setUserName(userName) {
    if (this.user) {
      this.user.name = userName;
    }
  }

  setImageUrl(imageUrl) {
    if (this.user) {
      this.user.imageUrl = imageUrl;
    }
  }

  gotoHome() {
    this.router.navigateByUrl('/projects');
  }

  public opneSnackBar(message: string, action?: string, config?: MatSnackBarConfig) {
    this.snackBar.open(message, action, config);
  }
}
