import { Injectable } from '@angular/core';
import _ from 'lodash';
import { Observable, Subject } from 'rxjs';

import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
// import { makeExecutableSchema, ITypeDefinitions } from 'graphql-tools';

import { IUser, IProject, IAttribute, ISharedProject, IApp, IPlot } from '../templates/template';
import { LoggerService } from './logger.service';
import { ApolloQueryResult } from 'apollo-client';

@Injectable({
  providedIn: 'root'
})
export class GraphqlClientService {
  public userQuery: QueryRef<IUser>;
  public projectsQuery: QueryRef<IProject[]>;
  public attributesQuery: QueryRef<IAttribute[]>;
  public sharedProjectsQuery: QueryRef<ISharedProject[]>;

  constructor(
    private apollo: Apollo,
    private log: LoggerService
  ) { }

  /**
   * 
   * @param auth_id 
   * @returns Observable<ApolloQueryResult<IUser>>
   */
  public getUser(auth_id): Observable<ApolloQueryResult<IUser>> {
    this.userQuery = this.apollo.watchQuery<IUser>({
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
    });
    return this.userQuery.valueChanges;
  }

  public getProjects(user_id): Observable<ApolloQueryResult<IProject[]>> {
    this.projectsQuery = this.apollo.watchQuery<IProject[]>({
      query: gql`
        query getProjects($created_user_id: uuid!) {
          Projects(where: {created_user_id: {_eq: $created_user_id}}) {
            id
            name
            description
            image
            label_x_min
            label_x_max
            label_y_min
            label_y_max
            plots {
              id
              name
              x
              y
              z
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
    })
    return this.projectsQuery.valueChanges;
  }

  public getSharedProjects(user_id): Observable<ApolloQueryResult<ISharedProject[]>> {
    this.sharedProjectsQuery = this.apollo.watchQuery<ISharedProject[]>({
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
              label_x_min
              label_x_max
              label_y_min
              label_y_max
              plots {
                id
                name
                x
                y
                z
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
    })
    return this.sharedProjectsQuery.valueChanges;
  }

  public getAttributes(): Observable<ApolloQueryResult<IAttribute[]>> {
    this.attributesQuery = this.apollo.watchQuery<IAttribute[]>({
      query: gql`
        query getAttributes {
          Attributes {
            id
            name
            arguments
          }
      }`
    })
    return this.attributesQuery.valueChanges;
  }

  public addUser(user: IUser) {
    const result = this.apollo.mutate({
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
    this.userQuery.refetch();
    return result;
  }

  public upadateUser(user: IUser) {
    const result = this.apollo.mutate({
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
    this.userQuery.refetch();
    return result;
  }

  public addProject(project: IProject) {
    const result = this.apollo.mutate({
      mutation: gql`
        mutation insert_Projects(
          $name: String!, $description: String, $image: String, $created_user_id: uuid!,
          $label_x_min: String!, $label_x_max: String!, $label_y_min: String!, $label_y_max: String!,
        ) {
          insert_Projects(
            objects: {
              name: $name, description: $description, image: $image, created_user_id: $created_user_id,
              label_x_min: $label_x_min, label_x_max: $label_x_max, label_y_min: $label_y_min, label_y_max: $label_y_max
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
        label_x_min: project.label_x_min,
        label_x_max: project.label_x_max,
        label_y_min: project.label_y_min,
        label_y_max: project.label_y_max,
        created_user_id: project.created_user_id
      }
    });
    this.projectsQuery.refetch();
    console.log('projects refetched...');
    return result;
  }

  public updateProject(project: IProject) {
    const result = this.apollo.mutate({
      mutation: gql`
        mutation update_Projects(
          $id: uuid!, $name: String!, $description: String, $image: String, $created_user_id: uuid!,
          $label_x_min: String!, $label_x_max: String!, $label_y_min: String!, $label_y_max: String!
        ) {
          update_Projects(
            where: {id: {_eq: $id}},
            _set : {
              name: $name, created_user_id: $created_user_id, description: $description, image: $image,
              label_x_min: $label_x_min, label_x_max: $label_x_max, label_y_min: $label_y_min, label_y_max: $label_y_max
            }) {
            returning {
              id
              created_user_id
              name
            }
          }
        }`,
      variables: {
        id: project.id,
        name: project.name,
        description: project.description,
        image: project.image,
        label_x_min: project.label_x_min,
        label_x_max: project.label_x_max,
        label_y_min: project.label_y_min,
        label_y_max: project.label_y_max,
        created_user_id: project.created_user_id
      }
    });
    this.projectsQuery.refetch();
    console.log('projects refetched...');
    return result;
  }

  public addPlot(plot: IPlot) {
    const result = this.apollo.mutate({
      mutation: gql`
        mutation insert_Plots(
          $name: String!, $project_id: uuid!, $created_user_id: uuid!, $x: Int!, $y: Int!,
        ) {
          insert_Plots(
            objects: {
              name: $name, project_id: $project_id, created_user_id: $created_user_id, x: $x, y: $y,
            }) {
            returning {
              id
              created_user_id
              name
              x
              y
            }
          }
        }`,
      variables: {
        name: plot.name,
        x: plot.x,
        y: plot.y,
        project_id: plot.project_id,
        created_user_id: plot.created_user_id
      }
    });
    this.projectsQuery.refetch();
    console.log('projects refetched...');
    return result;
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
