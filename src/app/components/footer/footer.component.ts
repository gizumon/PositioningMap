import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

type IFooterCmd = "project-list" | "project-add";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isPC: Boolean = false;
  // resizeObservable: Observable<UIEvent>;

  constructor() { }

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

  onClick(type: IFooterCmd) {
    switch(type) {
      case "project-list":
        break;
      case "project-add":
        break;
      default:
        break;
    }
  }

}
