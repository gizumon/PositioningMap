import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {
  tabIndexObservable: Observable<number>;

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
  
}
