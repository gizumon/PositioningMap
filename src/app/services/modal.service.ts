import { Injectable } from '@angular/core';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

export interface ISnackBarConfig {
  message: string,
  action?: 'OK' | 'DONE' | 'BACK' | '',
  config?: MatSnackBarConfig,
  isOpen?: boolean,
  onDissmissed?: string
}

export interface IModalConfig {
  message: string,
  action?: 'SUCCESS' | 'ERROR' | 'DONE' | 'CLOSE',
  config?: any,
  isOpen?: boolean,
  onDissmissed?: string
}

export interface IDissmissedAction {
  onDissmissed?: string
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public modalSubject: Subject<IModalConfig> = new Subject();
  public snackBarSubject: Subject<ISnackBarConfig> = new Subject();
  public dissmissedSubjuct: Subject<IDissmissedAction> = new Subject();

  constructor() {
    this.initialize();
  }

  private initialize() { }

  public openModal(params: IModalConfig) {
    params.isOpen = true;
    this.modalSubject.next(params);
  }

  public openSnackBar(params: ISnackBarConfig) {
    params.isOpen = true;
    this.snackBarSubject.next(params);
  }

  public closeModal() {
    var params:IModalConfig = {
      message: '',
      isOpen: false
    };
    this.modalSubject.next(params);
  }

  public closeSnackBar() {
    var params:ISnackBarConfig = {
      message: '',
      isOpen: false
    };
    this.snackBarSubject.next(params);
  }

  public dissmissed(onDissmissed: IDissmissedAction) {
    this.dissmissedSubjuct.next(onDissmissed);
  }
}
