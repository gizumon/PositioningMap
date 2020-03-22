import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { IModalConfig } from '../../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    // private modalService: ModalService,
    @Inject(MAT_DIALOG_DATA) public params: IModalConfig
  ) {
    console.log('modal', params);
  }

  ngOnInit() { }

  initialize() {  
    // this.modalService.modalSubject.subscribe(params => {
    //   this.type = params.type;
    //   if (params.isOpen) { return this.open(params); }
    //   return this.close();
    // });
  }

  public onOk() {
    // const data = {
    //   type: this.type,
    //   data: this.params.data
    // };
    // this.modalService.onOk(data);
  }

  public onCancel() {
    this.dialogRef.close();
  }

  // private close() {
  //   this.dialog.closeAll();
  // }

}
