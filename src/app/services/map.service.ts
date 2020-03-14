import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router'
import _ from 'lodash';

import { GraphqlClientService } from './graphql-client.service'
import { Template, IApp, IProject, IUser, ISharedProject, IAttribute } from '../templates/template';
import { LoginService, IUserCredential } from './login.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MapService {
  public isInitialized: boolean = false;
  public userSubject: Subject<IUser> = new Subject();
  public projectsSubject: Subject<IProject[]> = new Subject();
  public sharedProjectsSubject: Subject<ISharedProject[]> = new Subject();
  public attributesSubject: Subject<IAttribute[]> = new Subject();
  private userCredential: IUserCredential;
  private user: IUser;
  private projects: IProject[];
  private attributes: IAttribute[];
  private sharedProjects: ISharedProject[];

  constructor(
    private router: Router,
    private loginService: LoginService,
    private graphql: GraphqlClientService
  ) {
    this.loginService.userObservable.subscribe(() => {
      this.initialize(this.loginService.getUser());
    });
  }
  
  initialize(authUser) {
    if (!authUser) { return this.clear() }
    this.userCredential = authUser;
    const authId = this.userCredential.isAnonymous ? environment.auth.anonymous : this.userCredential.id;
    // user情報取得後、その他の情報を取得
    this.userSubject.subscribe((user: IUser) => {
      console.log('run init subject', this.user);
      this.setProjects(user.id);
      this.setSharedProjects(user.id);
    });
    this.setUser(authId); // authorization id からUser情報を取得
    this.setAttributes();
  }

  private setUser(authId) {
    this.graphql.getUser(authId).subscribe(result => {
      this.user = result.data['Users'][0];
      this.userSubject.next(this.user);
    });
  }

  private setAttributes() {
    this.graphql.getAttributes().subscribe(result => {
      this.attributes = result.data['Attributes'];
      this.attributesSubject.next(this.attributes);
    });
  }

  private setProjects(user_id) {
    this.graphql.getProjects(user_id).subscribe(result => {
      this.projects = result.data['Projects'];
      this.projectsSubject.next(this.projects);
      this.isInitialized = true;
    });
  }

  private setSharedProjects(user_id) {
    this.graphql.getSharedProjects(user_id).subscribe(result => {
      this.sharedProjects = result.data['SharedProjects'];
      this.sharedProjectsSubject.next(this.sharedProjects);
    });
  }

  public getUser(): IUser { return this.user }
  public getProjects(): IProject[] { return this.projects }
  public getSharedProjects(): ISharedProject[] { return this.sharedProjects }
  public getAttributes(): IAttribute[] { return this.attributes }
  public getApp(): IApp {
    return {
      user: this.getUser(),
      projects: this.getProjects(),
      shared_projects: this.getSharedProjects(),
      attributes: this.getAttributes()
    };
  }

  public getProjectById(id: string): IProject {
    return this.projects.filter((project) => {
      return project.id = id;
    })[0];
  }

  public getSharedProjectById(id: string): ISharedProject {
    return this.sharedProjects.filter((shared) => {
      return shared.id = id;
    })[0];
  }

  public clear() {
    this.userCredential = undefined;
    this.user = undefined;
    this.projects = undefined;
    this.attributes = undefined;
    this.sharedProjects = undefined;
    this.userSubject = new Subject();
    this.projectsSubject = new Subject();
    this.sharedProjectsSubject = new Subject();
    this.attributesSubject = new Subject();
  }
}
