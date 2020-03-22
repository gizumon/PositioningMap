import { Injectable } from '@angular/core';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { IPlot } from '../templates/template';
import { ModalComponent } from '../components/parts/modal/modal.component';

export interface ISnackBarConfig {
  message: string,
  action?: 'OK' | 'DONE' | 'BACK',
  config?: MatSnackBarConfig,
  isOpen?: boolean,
  onDissmissed?: string
}

export interface IModalConfig {
  type: '' | 'plot',
  data?: IPlot,
  config?: any,
  isOpen?: boolean,
}

export interface IDissmissedAction {
  onDissmissed?: string,
  data?: any,
}

export interface IOnOk {
  type: string, // 'plot'
  data?: IPlot 
}

export interface IOnCancel {
  type: string,
  data: any
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public modalSubject: Subject<IModalConfig> = new Subject();
  public snackBarSubject: Subject<ISnackBarConfig> = new Subject();
  public onDissmissedSubjuct: Subject<IDissmissedAction> = new Subject();
  public onOkSubject: Subject<IOnOk> = new Subject();
  public onCancelSubject: Subject<IOnCancel> = new Subject();
  constructor(
    private dialog: MatDialog
  ) {
    this.initialize();
  }

  private initialize() { }

  public openModal(params: IModalConfig) {
    params.isOpen = true;
    // this.modalSubject.next(params);
    console.log(params);
    const dialogRef = this.dialog.open(ModalComponent, {width: 'auto', data: params});
    dialogRef.afterClosed().subscribe(result => {
      this.onOk(result);
    });
  }

  public openSnackBar(params: ISnackBarConfig) {
    params.isOpen = true;
    this.snackBarSubject.next(params);
  }

  // public closeModal() {
  //   var params:IModalConfig = {
  //     type: '',
  //     isOpen: false
  //   };
  //   this.modalSubject.next(params);
  // }

  // public closeSnackBar() {
  //   var params:ISnackBarConfig = {
  //     message: '',
  //     isOpen: false
  //   };
  //   this.snackBarSubject.next(params);
  // }

  public dissmissed(onDissmissed: IDissmissedAction) {
    this.onDissmissedSubjuct.next(onDissmissed);
  }

  public onOk(onOk: IOnOk) {
    this.onOkSubject.next(onOk);
  }
}
