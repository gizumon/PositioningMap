import { Injectable } from '@angular/core';
import _ from 'lodash';
import { Observable, Subject } from 'rxjs';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { UserService } from './user.service';
import { IUser, IProject, IAttribute, ISharedProject, IApp } from '../templates/template';
import { LoggerService } from './logger.service';
import { subscribe, validate } from 'graphql';
import { ApolloQueryResult } from 'apollo-client';

export interface IInit {
  isInitialized: boolean
}

@Injectable({
  providedIn: 'root'
})
export class GraphqlClientService {

  constructor(
    private apollo: Apollo,
    private userService: UserService,
    private log: LoggerService
  ) {
    this.userService.userObservable.subscribe(() => {
      this.initialize();
    });
  }
  
  public initSubject: Subject<null> = new Subject();
  private isInitialized = {
    user: false,
    projects: false,
    sharedProjects: false,
    attributes: false
  };
  private userObservable: Observable<ApolloQueryResult<IUser>>;
  private user: IUser;
  private projectsObservable: Observable<ApolloQueryResult<IProject[]>>;
  private projects: IProject[];
  private attributesObservable: Observable<ApolloQueryResult<IAttribute[]>>;
  private attributes: IAttribute[];
  private sharedProjectsObservable: Observable<ApolloQueryResult<ISharedProject[]>>;
  private sharedProjects: ISharedProject[];

  public initialize() {
    console.log('graphql client');
    // user情報取得後、その他の情報を取得
    this.initSubject.subscribe({
      next: () => {
        console.log('run init subject', this.user);
        this.setProjects();
        this.setSharedProjects();
      }
    });
    this.setUser();
    this.setAttributes();
  }

  private setUser() {
    const auth_id = this.userService.user ? this.userService.user.id : 'guest';
    this.userObservable = this.apollo.watchQuery<IUser>({
      query: gql`
        {
          Users(where: {auth_id: {_eq: "${auth_id}"}}) {
            id
            auth_id
            name
          }
        }`
      }).valueChanges;
    this.userObservable.subscribe(result => {
      this.user = result.data['Users'][0];
      console.log('user', this.user);
      this.isInitialized.user = true;
      this.initSubject.next();
    });
  }

  private setProjects() {
    console.log('set projects');
    const id = this.user ? this.user.id : 'guest';
    this.projectsObservable = this.apollo.watchQuery<IProject[]>({
      query: gql`
      {
        Projects(where: {created_user_id: {_eq: "${id}"}}) {
          id
          name
          description
          image
          label {
            id
            x
            y
            z
          }
          plots {
            id
            name
            coordinate {
              id
              x
              y
              z
            }
            belongs {
              id
              attribute_id
              is_checked
            }
            created_user_id
          }
          created_user_id
        }
      }`
    }).valueChanges;
    this.projectsObservable.subscribe(result => {
      this.isInitialized.projects = true;
      this.projects = result.data['Projects'];
    });
  }

  private setSharedProjects() {
    console.log('set shared projects');
    const id = this.user ? this.user.id : 'guest';
    this.sharedProjectsObservable = this.apollo.watchQuery<ISharedProject[]>({
      query: gql`
      {
        SharedProjects(where: {user_id: {_eq: "${id}"}}) {
          id
          user {
            id
            auth_id
            name
          }
          project {
            id
            name
            description
            image
            label {
              id
              x
              y
              z
            }
            plots {
              id
              name
              coordinate {
                id
                x
                y
                z
              }
              belongs {
                id
                attribute_id
                is_checked
              }
              created_user_id
            }
            created_user_id
          }
          authority
        }
      }
      `
    }).valueChanges;
    this.sharedProjectsObservable.subscribe(result => {
      this.isInitialized.sharedProjects = true;
      this.sharedProjects = result.data['SharedProjects'];
      this.initSubject.complete();
      // console.log('run set shared project', this.sharedProjects);
    });
  }

  private setAttributes() {
    this.attributesObservable = this.apollo.watchQuery<IAttribute[]>({
      query: gql`
      {
        Attributes {
          id
          name
          arguments
        }
      }`
    }).valueChanges;
    this.attributesObservable.subscribe(result => {
      this.isInitialized.attributes = true;
      this.attributes = result.data['Attributes'];
    });
  }

  public getUserObservable(): Observable<ApolloQueryResult<IUser>> {
    return this.userObservable;
  }

  public getProjectsObservable(): Observable<ApolloQueryResult<IProject[]>> {
    return this.projectsObservable;
  }

  public getSharedProjectsObservable(): Observable<ApolloQueryResult<ISharedProject[]>> {
    return this.sharedProjectsObservable;
  }

  public getAttributesObservable(): Observable<ApolloQueryResult<IAttribute[]>> {
    return this.attributesObservable;
  }

  public getApp(): IApp {
    return {
      user: this.user,
      projects: this.projects,
      shared_projects: this.sharedProjects,
      attributes: this.attributes
    };
  }

  // public updateUser(data: IUser): boolean {
  //   if (!(data && _.isString(data.id) && _.isString(data.name) && _.isString(data.auth_id))) {
  //     this.log.warn(`Validation Failed: ${data}`);
  //     return false;
  //   }
  //   this.apollo.mutate({
  //     mutation: })
  // }
}
