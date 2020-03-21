import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";

import { Template, IUser } from '../templates/template';
import { LoggerService } from './logger.service';
// import { GraphqlClientService } from '../services/graphql-client.service';

export interface IAuthCredential {
  id: string,
  name: string,
  isAnonymous: Boolean,
  imageUrl: string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginObservable: Observable<firebase.User>;
  loginSubject:Subject<IAuthCredential> = new Subject();
  auth: IAuthCredential = {
      id: '',
      name: '',
      isAnonymous: true,
      imageUrl: ''
  };

  constructor(
    private router: Router,
    private log: LoggerService,
    private afAuth: AngularFireAuth
  ) {
    this.initialize();
  }

  initialize() {
    this.loginObservable = this.afAuth.authState;
    this.loginObservable.subscribe(u => {
      this.log.info(u, 'UserStatus');
      if (u) {
        this.setUser(u);
      } else {
        this.clearUser();
      }
      this.loginSubject.next(this.auth);
    });
  }

  getAuth(): IAuthCredential {
    return this.auth;
  }

  setUser(data: firebase.User) {
    this.auth = {
      id: data.uid,
      name: data.displayName,
      isAnonymous: data.isAnonymous,
      imageUrl: data.photoURL
    }
  }

  clearUser() {
    this.auth = {
      id: '',
      name: '',
      isAnonymous: true,
      imageUrl: ''
    }
  }

  isAnonymous(): Boolean {
    return this.auth.isAnonymous;
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
      this.log.info(this.auth, 'Logout');
    }).catch(e => {
      this.log.error(e, 'Logout');
    });
  }
}
