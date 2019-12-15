import { Component, OnChanges, AfterViewChecked, OnInit } from '@angular/core';
import { UserService, IUserCredential } from './services/user.service';
import { Router } from '@angular/router';
import { LoggerService } from './services/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLogin: Boolean = false;
  isAnonymous: Boolean = false;
  userName: String;

  constructor(
    private userService: UserService,
    private router: Router,
    private log: LoggerService
  ) {

  }
  title = 'PositioningMap';

  ngOnInit() {
    this.userService.userObservable.subscribe((user) => {
      this.log.info(user, 'Login');
      this.isLogin = Boolean(user);
      if(this.isLogin) {
        this.userName = user.displayName;
        this.isAnonymous = user.isAnonymous;
        this.router.navigateByUrl('/projects');
      } else {
        this.userName = '';
        this.isAnonymous = false;
        this.router.navigateByUrl('/login');
      }
    });
  }

  logout() {
    this.userService.logout();
  }
}
