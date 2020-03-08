import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { ModalService, ISnackBarConfig } from '../../../services/modal.service';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent {

  constructor(
    public snackBar: MatSnackBar,
    private modalService: ModalService
  ) {
    this.initialize();
  }
  
  private defaultConfig: MatSnackBarConfig = {
    duration: 2000
  } 

  private initialize() {
    this.modalService.snackBarSubject.subscribe((params) => {
      if (params.isOpen) {
        this.open(params);
      } else {
        this.close();
      }
    })
  }

  private open(params: ISnackBarConfig) {
    console.log(params);
    this.snackBar.open(params.message, params.action, params.config || this.defaultConfig)
  }

  private close() {
    this.snackBar.dismiss();
  }
}
