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
      label_x_min: obj.label_x_min,
      label_x_max: obj.label_x_max,
      label_y_min: obj.label_y_min,
      label_y_max: obj.label_y_max,
      created_user_id: this.user.id
    }
    if (type === 'UPDATE') { data.id = obj.id; }
    if (
      (type === 'ADD' || _.isString(data.id)) &&
      !_.isEmpty(data.name) && _.isString(data.name) &&
      !_.isEmpty(data.label_x_min) && _.isString(data.label_x_min) &&
      !_.isEmpty(data.label_x_max) && _.isString(data.label_x_max) &&
      !_.isEmpty(data.label_y_min) && _.isString(data.label_y_min) &&
      !_.isEmpty(data.label_y_max) && _.isString(data.label_y_max) &&
      !_.isEmpty(data.created_user_id) && _.isString(data.created_user_id)
    ) {
      isValid = true;
    }
    return {data: data, isValid: isValid};
  }
}
