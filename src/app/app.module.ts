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
  MatInputModule
 } from '@angular/material';
 import { FormsModule }   from '@angular/forms';

import { ProjectListComponent } from './components/project-list/project-list.component';
import { MapComponent } from './components/map/map.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ProjectListComponent,
    MapComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
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
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
