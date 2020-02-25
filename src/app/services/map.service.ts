import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GraphqlClientService } from './graphql-client.service'

import { Template, IApp, IProject, IUser, ISharedProject } from '../templates/template'
import { UserService, IUserCredential } from '../services/user.service';
import { Router } from '@angular/router'
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class MapService {
  userCredential: IUserCredential;
  app: IApp;
  sharedProjects: IProject[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private graphql: GraphqlClientService
  ) {
    this.initialize();
  }
  
  initialize() {
    // to be updated
    this.userCredential = this.userService.getUser();
    this.setApp();
  }

  private setApp() {
    if(this.userService.isAnonymous()) {
      this.app = Template.sample();
    } else {
      this.app = this.graphql.getApp();
    }
  }

  getApp(): IApp {
    if (!this.app) {
      return Template.sample();
    }
    return this.app;
  }

  // getProjects(): IProject[] {

  // }

  // setShareProjects(app: IApp) {
  //   return this.graqhql.sharedProjects.map(share => {
      
  //   });
  // }

  // getSharedProjects(): IProject[] {
  //   return this.sharedProjects;
  // }

  getProject(user_id: string, project_id: string): IProject {
    // TODO: user_idとproject_idからプロジェクトを検索
    return Template.sample().projects[0]
  }
}
