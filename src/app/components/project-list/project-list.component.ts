import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import _ from 'lodash';

import { Template, IApp, IUser, IProject, ISharedProject } from 'src/app/templates/template';
import { GraphqlClientService } from '../../services/graphql-client.service';
import { MapService } from '../../services/map.service';
import { ModalService } from '../../services/modal.service';
import { ValidationService } from '../../services/validation.service';
import { ContainerService, IFooterCmd } from '../../services/container.service';

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
  public selectedTab: number = 0;
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
  private tabConfig = {
    'project-list': 0,
    'project-shared': 1,
    'project-add': 2
  }

  constructor(
    private mapService: MapService,
    private modalService: ModalService,
    private valid: ValidationService,
    private graphql: GraphqlClientService,
    private container: ContainerService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initialize();
    this.container.tabSubject.subscribe((tab: IFooterCmd) => {
      this.selectedTab = this.tabConfig[tab] || 0;
    });
  }

  ngOnDestroy() { }

  private initialize() {
    if (this.mapService.isInitialized) {
      this.setApp(); 
    }
    this.userSubscription = this.mapService.userSubject.subscribe(data => this.app['user'] = _.cloneDeep(data) );
    this.projectsSubscription = this.mapService.projectsSubject.subscribe(data => this.app['projects'] = _.cloneDeep(data));
    this.attributesSubscription = this.mapService.attributesSubject.subscribe(data => this.app['attributes'] = _.cloneDeep(data));
    this.sharedProjectsSubscription = this.mapService.sharedProjectsSubject.subscribe(data => {
      this.app['shared_projects'] = _.cloneDeep(data);
      this.setSharedProjects();
    });
  }

  private setApp() {
    this.app = this.mapService.getApp();
    this.setSharedProjects();
  }
  private setSharedProjects() {
    this.sharedProjects = this.app['shared_projects'].map((shared) => {
      shared.project.authority = shared.authority;
      return shared.project;
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
      this.modalService.openSnackBar({
        message: `Please fill inputs: ${this.newProject.name}`,
        action: 'OK'
      });
      return;
    }
    this.graphql.addProject(data).subscribe((res) => {
      console.log('Got data', res);
      this.modalService.openSnackBar({
        message: `Success add project: ${data.name}`,
        action: 'OK'
      });
      // initialize new project data
      this.newProject = Template.project();
    },(error) => {
      console.log('There was an error sending the query', error);
      this.modalService.openSnackBar({
        message: `Failed add project: ${this.newProject.name}`,
        action: 'OK'
      });
    });
  }

  public updateProject(project) {
    const {data , isValid} = this.valid.validProject(project, 'UPDATE');
    if(!isValid) {
      this.modalService.openSnackBar({
        message: `Please fill inputs: ${project.name}`,
        action: 'OK'
      });
      // projectの初期化
      this.undoEditById(data.id);
      return;
    }
    this.graphql.updateProject(data).subscribe((res) => {
      this.modalService.openSnackBar({
        message: `Success updated project: ${data.name}`
      });
    },(error) => {
      console.log('There was an error sending the query', error);
      this.modalService.openSnackBar({
        message: `Failed updated project: ${this.newProject.name}`
      });
      // projectの初期化
      this.undoEditById(data.id);
    });
  }

  private undoEditById(id: string) {
    console.log(this.app);
    this.app.projects = this.mapService.getProjects();
    console.log(this.app);
    this.changeDetectorRef.detectChanges();
  }

  private clear() {
    this.app = undefined;
    this.sharedProjects = undefined;
    this.selectedTab = 0;
    this.toggle = {target: '', open: 'none'};
    this.newProject = Template.project();
    this.userSubscription.unsubscribe();
    this.projectsSubscription.unsubscribe();
    this.attributesSubscription.unsubscribe();
    this.sharedProjectsSubscription.unsubscribe();
  }
}
