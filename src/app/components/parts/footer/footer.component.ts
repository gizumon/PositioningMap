import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContainerService } from '../../../services/container.service';
import { Router, NavigationEnd } from '@angular/router';

type IFooterCmd = 'project-list' | 'project-shared' | 'project-add';
type IPage = 'login' | 'projects' | 'map';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public isPC: Boolean = false;
  public page: IPage;
  // resizeObservable: Observable<UIEvent>;

  constructor(
    // private projectList: ProjectListComponent
    private containerService: ContainerService,
    private router: Router
  ) { }

  ngOnInit() {
    // window sizeがスマートフォンサイズ以上か判定
    this.checkWindowSize(window.innerWidth);
    this.containerService.resizeObserve().subscribe(e => {
      this.checkWindowSize(window.innerWidth);
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event.url);
        this.page = event.url.match('projects') ? 'projects'
                  : event.url.match('map') ? 'map'
                  : 'login';
      }
    })
  }

  checkWindowSize(windowSize: number) {
    this.isPC = windowSize > 480;
  }

  onClick(cmd: IFooterCmd) {
    this.containerService.changeTab(cmd);
  }

}
