import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Template, IApp, IUser, IProject, ISharedProject } from 'src/app/templates/template';
import { UserService, IUserCredential } from 'src/app/services/user.service';
// import { MapService } from 'src/app/services/map.service';
import { GraphqlClientService } from '../../services/graphql-client.service'

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  app: IApp;
  sharedProjects: IProject[];
  step: number = -1;
  selectedTab: number = 0; 
  targetId: string = '';
  newProject:IProject = Template.project();

  constructor(
    private userService: UserService,
    private graphql: GraphqlClientService
  ) {
    // this.mapService.initialize();
    // this.userService.initialize();
  }

  ngOnInit() {
    console.log('run ngOninit in project-list');
    this.graphql.initSubject.subscribe({
      complete: () => {
        console.log('run initialize in project-list');
        this.initialize();
        // Subjectを初期化
        this.graphql.initSubject = new Subject();
      }
    });
  }

  ngOnDestroy() {
    this.clear();
  }

  initialize() {
    this.app = this.graphql.getApp();
    if (this.app.shared_projects) {
      this.sharedProjects = this.app.shared_projects.map((shared) => {
        shared.project.authority = shared.authority;
        return shared.project;
      });  
    }
    console.log('app', this.app);
  }

  setStep(index: number, projectId: string) {
    // allopen : 0, allclose: -1  
    this.step = index === 0 && this.step === 0 ? -1 : index;
    this.targetId = projectId || this.targetId;
  }

  changeTab(index: number) {
    this.selectedTab = index;
  }

  goto(project: IProject) {
    // {path: 'map/:id', component: MapComponent }
  }

  clear() {
    this.app = undefined;
    this.sharedProjects = undefined;
    this.step = -1;
    this.selectedTab = 0;  
    this.targetId = '';
    this.newProject = Template.project();
  }
}
