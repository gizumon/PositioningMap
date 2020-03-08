import { Injectable } from '@angular/core';
import _ from 'lodash';
import { IProject, IUser } from '../templates/template';
import { MapService } from './map.service';

export type IValidType = 'ADD' | 'UPDATE'; 

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private user: IUser;

  constructor(
    private mapService: MapService
  ) {
    this.initialize();
  }

  private initialize() {
    this.mapService.userSubject.subscribe({
      next: (user: IUser) => { console.log(`validation service: Init:`, user); this.user = user; }
    });
  }

  public validProject(obj: IProject, type: IValidType): {data: IProject, isValid: boolean} {
    let isValid = false;
    let data: IProject = {
      name: obj.name,
      description: obj.description,
      image: obj.image,
      label: obj.label,
      created_user_id: this.user.id
    }
    if (type === 'UPDATE') { data.id = obj.id; }
    if (
      (type === 'ADD' || _.isString(data.id)) &&
      _.isString(data.name) &&
      _.isObject(data.label) &&
      _.isString(data.label.x[0]) &&
      _.isString(data.label.x[1]) &&
      _.isString(data.label.y[0]) &&
      _.isString(data.label.y[1]) &&
      _.isString(data.created_user_id)
    ) {
      isValid = true;
    }
    return {data: data, isValid: isValid};
  }
}
