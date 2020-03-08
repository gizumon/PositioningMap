import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type IFooterCmd = 'project-list' | 'project-shared' | 'project-add';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {
  public tabSubject: Subject<IFooterCmd>;
  constructor() {
    
  }
  
  // tabObservable() {
  //   this.tabIndexObservable = new Observable.create((observer) => {
      
  //   });
  // }

  resizeObserve(): Observable<UIEvent> {
    return Observable.create(observer => {
      window.addEventListener('resize', (e) => {
        console.log(e);
        observer.next(e);
      });
    });
  }
  
  changeTab(cmd: IFooterCmd) {
    this.tabSubject.next(cmd);
  }
}
