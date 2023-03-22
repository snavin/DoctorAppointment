import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import { LoginModalComponent } from '../login-modal/login-modal.component'

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css']
})
export class LoginButtonComponent {
  
  constructor(public dialog: MatDialog) {}

  LoginDialog() {
    const dialogRef = this.dialog.open(LoginModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
