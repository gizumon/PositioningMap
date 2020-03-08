import { Injectable } from '@angular/core';
import _ from 'lodash';
import { Observable, Subject } from 'rxjs';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { makeExecutableSchema, ITypeDefinitions } from 'graphql-tools';

import { IUser, IProject, IAttribute, ISharedProject, IApp } from '../templates/template';
import { LoggerService } from './logger.service';
import { ApolloQueryResult } from 'apollo-client';
import { type } from 'os';

@Injectable({
  providedIn: 'root'
})
export class GraphqlClientService {
  public userObservable: Observable<ApolloQueryResult<IUser>>;
  public projectsObservable: Observable<ApolloQueryResult<IProject[]>>;
  public attributesObservable: Observable<ApolloQueryResult<IAttribute[]>>;
  public sharedProjectsObservable: Observable<ApolloQueryResult<ISharedProject[]>>;

  constructor(
    private apollo: Apollo,
    private log: LoggerService
  ) { }

  /**
   * 
   * @param auth_id 
   * @returns Observable<ApolloQueryResult<IUser>>
   */
  public getUser(auth_id) {
    return this.userObservable = this.apollo.watchQuery<IUser>({
      query: gql`
        query getUser($auth_id: String!) {
          Users(where: {auth_id: {_eq: $auth_id}}) {
            id
            auth_id
            name
          }
        }`,
      variables: {
        auth_id: auth_id
      }
    }).valueChanges;
  }

  public getProjects(user_id) {
    return this.projectsObservable = this.apollo.watchQuery<IProject[]>({
      query: gql`
        query getProjects($created_user_id: uuid!) {
          Projects(where: {created_user_id: {_eq: $created_user_id}}) {
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
        }`,
      variables: {
        created_user_id: user_id
      }
    }).valueChanges;
  }

  public getSharedProjects(user_id) {
    return this.sharedProjectsObservable = this.apollo.watchQuery<ISharedProject[]>({
      query: gql`
        query getSharedProjects($user_id: uuid!) {
          SharedProjects(where: {user_id: {_eq: $user_id}}) {
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
        }`,
      variables: {
        user_id: user_id
      }
    }).valueChanges;
  }

  public getAttributes() {
    return this.attributesObservable = this.apollo.watchQuery<IAttribute[]>({
      query: gql`
        query getAttributes {
          Attributes {
            id
            name
            arguments
          }
      }`
    }).valueChanges;
  }

  public addUser(user: IUser) {
    return this.apollo.mutate({
      mutation: gql`
        mutation insert_User($auth_id: String!, $name: String!) {
          insert_Users(objects: {auth_id: $auth_id, name: $name}) {
            returning {
              id
              auth_id
              name
            }
          }
        }`,
      variables: {
        auth_id: user.auth_id,
        name: user.name
      }
    });
  }

  public upadateUser(user: IUser) {
    return this.apollo.mutate({
      mutation: gql`
        mutation update_User($id: uuid!, $name: String!) {
          update_Users(where: {id: {_eq: $id}}, _set: {name: $name})
            returning {
              id
              auth_id
              name
            }
          }
        }`,
      variables: {
        name: user.name
      }
    });
  }

  public addProject(project: IProject) {
    return this.apollo.mutate({
      mutation: gql`
        mutation insert_Projects($name: String!, $description: String, $image: String,
                                 $label_Xmin: String!, $label_Xmax: String!, $label_Ymin: String!, $label_Ymax: String!,
                                 $created_user_id: uuid!) {
          insert_Projects(objects: {
                            name: $name, description: $description, image: $image, created_user_id: $created_user_id,
                            label: { data: { x: "[$label_Xmin, $label_Xmax]", y: "[$label_Ymin, $label_Ymax]" } }
                          }) {
            returning {
              id
              created_user_id
              name
            }
          }
        }`,
      variables: {
        name: project.name,
        description: project.description,
        image: project.image,
        label_Xmin: project.label.x[0],
        label_Xmax: project.label.x[1],
        label_Ymin: project.label.y[0],
        label_Ymax: project.label.y[1],
        created_user_id: project.created_user_id
      }
    });
  }
  public updateProject(project: IProject) {
    return this.apollo.mutate({
      mutation: gql`
        mutation insert_Projects($name: String!, $description: String, $image: String,
                                 $label_Xmin: String!, $label_Xmax: String!, $label_Ymin: String!, $label_Ymax: String!,
                                 $created_user_id: uuid!) {
          insert_Projects(objects: {
                            name: $name, description: $description, image: $image, created_user_id: $created_user_id,
                            label: { data: { x: "[$label_Xmin, $label_Xmax]", y: "[$label_Ymin, $label_Ymax]" } }
                          }) {
            returning {
              id
              created_user_id
              name
            }
          }
        }`,
      variables: {
        name: project.name,
        description: project.description,
        image: project.image,
        label_Xmin: project.label.x[0],
        label_Xmax: project.label.x[1],
        label_Ymin: project.label.y[0],
        label_Ymax: project.label.y[1],
        created_user_id: project.created_user_id
      }
    });
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
