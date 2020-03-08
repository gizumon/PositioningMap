import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Template, IApp, IUser, IProject, ISharedProject } from 'src/app/templates/template';
import { GraphqlClientService } from '../../services/graphql-client.service';
import { MapService } from '../../services/map.service';
import { ModalService } from '../../services/modal.service';
import { ValidationService } from '../../services/validation.service';
import { ContainerService } from '../../services/container.service';

interface IToggleConfig {
  target: string,
  open: 'all' | 'project' | 'label' | 'attribute' | 'none' 
}

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  public app: IApp = {
    user: {},
    projects: [],
    shared_projects: [],
    attributes: []
  };
  public sharedProjects: IProject[];
  public step: number = -1;
  public selectedTab: number = 0;
  public targetId: string = '';
  public toggle: IToggleConfig = {
    target: '',
    open: 'none'
  }
  public newProject:IProject = Template.project();
  public isInitialized: boolean = false;
  private userSubscription: Subscription;
  private projectsSubscription: Subscription;
  private sharedProjectsSubscription: Subscription;
  private attributesSubscription: Subscription;

  constructor(
    private mapService: MapService,
    private modalService: ModalService,
    private valid: ValidationService,
    private graphql: GraphqlClientService,
    private container: ContainerService
  ) { }

  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy() {
    this.clear();
  }

  private initialize() {
    this.userSubscription = this.mapService.userSubject.subscribe(data => this.app['user'] = data );
    this.projectsSubscription = this.mapService.projectsSubject.subscribe(data => this.app['projects'] = data);
    this.attributesSubscription = this.mapService.projectsSubject.subscribe(data => this.app['attributes'] = data);
    this.sharedProjectsSubscription = this.mapService.sharedProjectsSubject.subscribe(data => {
      this.app['shared_projects'] = data;
      this.sharedProjects = data.map((shared) => {
        shared.project.authority = shared.authority;
        return shared.project;
      });
    });
  }

  public setToggle(config: IToggleConfig) {
    this.toggle = config;
  }

  public changeTab(index: number) {
    this.selectedTab = index;
  }

  public addProject() {
    const {data , isValid} = this.valid.validProject(this.newProject, 'ADD');
    if(!isValid) {
      return this.modalService.openSnackBar({
        message: `Please fill inputs: ${this.newProject.name}`
      });
    }
    this.graphql.addProject(data).subscribe((res) => {
      console.log('Got data', res);
      this.modalService.openSnackBar({
        message: `Success add project: ${data.name}`
      });
      // initialize new project data
      this.newProject = Template.project();
    },(error) => {
      console.log('There was an error sending the query', error);
      this.modalService.openSnackBar({
        message: `Failed add project: ${this.newProject.name}`
      });
    });
  }

  private clear() {
    this.app = undefined;
    this.sharedProjects = undefined;
    this.step = -1;
    this.selectedTab = 0;  
    this.targetId = '';
    this.newProject = Template.project();
    this.userSubscription.unsubscribe();
    this.projectsSubscription.unsubscribe();
    this.attributesSubscription.unsubscribe();
    this.sharedProjectsSubscription.unsubscribe();
  }
}
