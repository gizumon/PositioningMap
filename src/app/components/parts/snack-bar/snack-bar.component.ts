import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { ModalService, ISnackBarConfig } from '../../../services/modal.service';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent {
  private defaultConfig: MatSnackBarConfig = {
    duration: 5000
  }

  constructor(
    public snackBar: MatSnackBar,
    private modalService: ModalService
  ) {
    this.initialize();
  }

  private initialize() {
    this.modalService.snackBarSubject.subscribe((params) => {
      if (params.isOpen) { return this.open(params); }
      return this.close();
    })
  }

  private open(params: ISnackBarConfig) {
    const config = params.config || this.defaultConfig;
    this.snackBar.open(params.message, params.action, config).afterDismissed().subscribe((data) => {
      if (data.dismissedByAction) {
        this.modalService.dissmissed({onDissmissed: params.onDissmissed});
      }
    });
  }

  private close() {
    this.snackBar.dismiss();
  }
}
