import { Component, OnInit } from '@angular/core';
import { Template, IApp, IUser, IProject } from '../../templates/template';
import { MatAccordion } from '@angular/material';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  app: IApp;
  step: number = -1;
  targetId: String = '';
  newProject:IProject = Template.project();

  constructor() { }

  ngOnInit() {
    let user: IUser = this.getUser();
    this.initialize(user);
  }

  initialize(user: IUser): void {
    this.app = this.getApp(user);
  }
  
  getUser(): IUser {
    return {
      id: 'dummy',
      name: 'dummy'
    };
  }

  getApp(user): IApp {
    return Template.sample();
  }

  setStep(index: number, projectId: String) {
    // allopen : 0, allclose: -1  
    this.step = index === 0 && this.step === 0 ? -1 : index;
    this.targetId = projectId || this.targetId;
  }
    expand(id) {
    let target: any = document.getElementById('#' + id);
    target.openAll();
  }
}
