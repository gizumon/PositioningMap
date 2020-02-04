import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  info(message: string | Object, prefix?) {
    prefix = '[INFO]' + prefix + ':';
    this.flowLog(message, prefix);
  }

  warn(message: string | Object, prefix?) {
    prefix = '[WARN]' + prefix + ':';
    this.flowLog(message, prefix);
  }

  error(message: string | Object, prefix?) {
    prefix = '[ERROR]' + prefix + ':';
    this.flowLog(message, prefix);
  }
  
  flowLog(message: string | Object, prefix: string) {
    if (typeof message === 'object') {
      console.log(prefix + JSON.stringify(message));      
    } else {
      console.log(prefix + message);
    }
  }
}
