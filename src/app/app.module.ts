import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';

import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import {FirebaseUIModule, firebaseui} from 'firebaseui-angular';
 
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';

import {
  MatIconModule,
  MatToolbarModule,
  MatTabsModule,
  MatCardModule,
  MatButtonModule,
  MatDialogModule,
  MatTreeModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatInputModule,
  MatSliderModule,
  MatSnackBarModule
 } from '@angular/material';
import { FormsModule }   from '@angular/forms';

import { ProjectListComponent } from './components/project-list/project-list.component';
import { MapComponent } from './components/map/map.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/parts/footer/footer.component';
import { SnackBarComponent } from './components/parts/snack-bar/snack-bar.component';
import { ModalComponent } from './components/parts/modal/modal.component';

// import { LoggerService } from './services/logger.service';
// import { MapService } from './services/map.service';
// import { LoginService } from './services/login.service';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // {
    //   scopes: [
    //     'public_profile',
    //     'email',
    //     'user_likes',
    //     'user_friends'
    //   ],
    //   customParameters: {
    //     'auth_type': 'reauthenticate'
    //   },
      // provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    // },
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    },
    // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
};

@NgModule({
  declarations: [
    AppComponent,
    ProjectListComponent,
    MapComponent,
    LoginComponent,
    FooterComponent,
    SnackBarComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule,
    FormsModule,
    GraphQLModule,
    HttpClientModule,
    // NgbModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatTreeModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatSliderModule,
    MatSnackBarModule
  ],
  providers: [
    // LoggerService,
    // MapService,
    // LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
