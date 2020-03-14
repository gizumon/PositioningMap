import { Component, OnChanges, AfterViewChecked, OnInit } from '@angular/core';
import { LoginService, IUserCredential } from './services/login.service';
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
  isLogin: Boolean = false;
  isAnonymous: Boolean = false;
  userName: string;

  constructor(
    private loginService: LoginService,
    private mapService: MapService,
    private router: Router,
    private log: LoggerService,
    public snackBar: MatSnackBar
  ) {

  }
  title = 'PosMap';

  ngOnInit() {
    this.loginService.userObservable.subscribe((user) => {
      this.log.info(user, 'Login');
      this.isLogin = Boolean(user);
      if(this.isLogin) {
        this.isAnonymous = user.isAnonymous;
        this.router.navigateByUrl('/projects');
      } else {
        this.setUserName('');
        this.isAnonymous = false;
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
    this.userName = userName
  }

  gotoHome() {
    this.router.navigateByUrl('/projects');
  }

  public opneSnackBar(message: string, action?: string, config?: MatSnackBarConfig) {
    this.snackBar.open(message, action, config);
  }
}
