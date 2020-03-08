import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

import { LoginService, IUserCredential } from '../../services/login.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private router: Router,
    private log: LoggerService,
    // private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {

  }

  successCallback(event) {
    this.log.info(event,'Login');
  }

  errorCallback(event) {
    this.log.error(event, 'Login');
  }
  // var ui = new firebaseui.auth.AuthUI(firebase.auth());
}
