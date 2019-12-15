import { Component, OnInit } from '@angular/core';
import { Template, IApp, IUser, IProject, ISharedProjects } from 'src/app/templates/template';
import { UserService, IUserCredential } from 'src/app/services/user.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  app: IApp;
  sharedProjects: IProject[];
  step: number = -1;
  targetId: String = '';
  newProject:IProject = Template.project();

  constructor(
    private userService: UserService,
    private mapService: MapService
  ) {
    // this.mapService.initialize();
    // this.userService.initialize();
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.app = this.mapService.getApp();
    this.sharedProjects = this.mapService.getSharedProjects();
  }

  setStep(index: number, projectId: String) {
    // allopen : 0, allclose: -1  
    this.step = index === 0 && this.step === 0 ? -1 : index;
    this.targetId = projectId || this.targetId;
  }

  goto(project: IProject) {
    
    // {path: 'map/:id', component: MapComponent }
    
  }
}
