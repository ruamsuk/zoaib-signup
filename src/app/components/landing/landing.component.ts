import { Component } from '@angular/core';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  constructor(private dialog: DialogService) {
  }


  confirmCancelDialog() {
    const dialogRef = this.dialog.confirmDialog({
      title: 'Please confirm action',
      message: 'Please confirm whether you want to do this!',
      confirmText: 'Confirm',
      cancelText: 'Cancel'
    });
    dialogRef.subscribe(res => {
      console.log(res);
    })
  }

  yesNoDialog() {
    const dialogRef = this.dialog.confirmDialog({
      title: 'Are you sure?',
      message: 'Are you sure to do this?',
      confirmText: 'Yes',
      cancelText: 'No'
    });
    dialogRef.subscribe(res => {
      console.log(res);
    })
  }

  yesNotSure() {
    const dialogRef = this.dialog.confirmDialog({
      title: 'Are you sure?',
      message: 'Are you sure to do this?',
      confirmText: 'Yes',
      cancelText: 'No'
    });
    dialogRef.subscribe(res => {
      console.log(res);
    })
  }
}
