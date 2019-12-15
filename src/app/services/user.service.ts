import { Injectable } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";

import { Template, IUser } from '../templates/template'

export interface IUserCredential {
  id: String,
  name: String,
  isAnonymous: Boolean
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userObservable: Observable<firebase.User>;
  user: IUserCredential = {
      id: '',
      name: '',
      isAnonymous: true
  };

  constructor(
    private router: Router,
    private log: LoggerService,
    private afAuth: AngularFireAuth
  ) {
    this.initialize();
  }

  initialize() {
    this.userObservable = this.afAuth.authState;
    this.userObservable.subscribe(u => {
      this.log.info(u, 'UserStatus');
      if (u) {
        this.setUser(u);
      } else {
        this.clearUser();
      }
    });
  }

  getUser(): IUserCredential {
    return this.user;
  }

  setUser(data: firebase.User) {
    this.user = {
      id: data.uid,
      name: data.displayName,
      isAnonymous: data.isAnonymous
    }
  }

  clearUser() {
    this.user = {
      id: '',
      name: '',
      isAnonymous: true
    }
  }

  isAnonymous(): Boolean {
    return this.user.isAnonymous;
  }

  createUser(email, password): void {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(e => {
      this.log.info(e, 'CreateUser');
    }).catch((error) => {
      this.log.error(error.message, `CreateUser(${error.code})`);
    });
  }

  // async loginWithInput(email, password) {
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   await this.afAuth.auth.signInWithPopup(provider);
  // }

  async loginWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().languageCode = 'ja';
    provider.setCustomParameters({
      'login_hint': 'example@gmail.com'
    });
    await this.afAuth.auth.signInWithPopup(provider);
  }

  async logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
      this.log.info(this.user, 'Logout');
    }).catch(e => {
      this.log.error(e, 'Logout');
    });
  }
}
