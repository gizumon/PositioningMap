import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Template, IApp, IProject, IUser, ISharedProjects } from '../templates/template'
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
    private userService: UserService
  ) {
    this.initialize();
  }
  
  initialize() {
    // to be updated
    this.userCredential = this.userService.getUser();
    this.setApp();
    this.setShareProjects(this.app);
  }

  setApp() {
    if(this.userService.isAnonymous()) {
      this.app = Template.sample();
    } else {
      this.app = Template.sample();
    }
  }

  getApp(): IApp {
    if (this.app) {
      return Template.sample();
    } else {
      return this.app;
    }
  }

  setShareProjects(app: IApp) {
    this.app.shared_projects.forEach((shared) => {
      this.sharedProjects.push(this.getProject(shared.shared_user_id, shared.project_id));
    });
  }

  getSharedProjects(): IProject[] {
    return this.sharedProjects;
  }

  getProject(user_id: String, project_id: String): IProject {
    // TODO: user_idとproject_idからプロジェクトを検索
    return Template.sample().projects[0]
  }
}
