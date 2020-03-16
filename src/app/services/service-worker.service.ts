import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerService {

  constructor(updates: SwUpdate) {
    updates.available.subscribe(event => {
      console.log(event);
      if (event) {
        updates.activateUpdate().then(() => {document.location.reload();});
      }
    });
  }
}
