import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  info(message: String | Object, prefix?) {
    prefix = '[INFO]' + prefix + ':';
    this.flowLog(message, prefix);
  }

  warn(message: String | Object, prefix?) {
    prefix = '[WARN]' + prefix + ':';
    this.flowLog(message, prefix);
  }

  error(message: String | Object, prefix?) {
    prefix = '[ERROR]' + prefix + ':';
    this.flowLog(message, prefix);
  }
  
  flowLog(message: String | Object, prefix: String) {
    if (typeof message === 'object') {
      console.log(prefix + JSON.stringify(message));      
    } else {
      console.log(prefix + message);
    }
  }
}
