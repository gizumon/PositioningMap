import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
// import { ProjectListComponent } from '../project-list/project-list.component';

// import { ProjectListComponent } from '../project-list/project-list.component';

type IFooterCmd = "project-list" | "project-shared" | "project-add";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isPC: Boolean = false;
  // resizeObservable: Observable<UIEvent>;

  constructor(
    // private projectList: ProjectListComponent
  ) { }

  ngOnInit() {
    // window sizeがスマートフォンサイズ以上か判定
    this.checkWindowSize(window.innerWidth);
    this.resizeObserve().subscribe(e => {
      this.checkWindowSize(window.innerWidth);
    });
  }

  resizeObserve(): Observable<UIEvent> {
    return Observable.create(observer => {
      window.addEventListener('resize', (e) => {
        console.log(e);
        observer.next(e);
      });
    });
  }

  checkWindowSize(windowSize: Number) {
    this.isPC = windowSize > 480;
  }

  public onClick(type: IFooterCmd) {
    switch(type) {
      case "project-list":
        // ProjectListComponent.changeTab(0);
        break;
      case "project-shared":
        // this.projectList.changeTab(1);
        break;
      case "project-add":
        // this.projectList.changeTab(2);
        break;
      default:
        break;
    }
  }

}
