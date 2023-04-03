import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css']
})
export class LoginButtonComponent {
  is_logged: boolean = false;
  user_data: UserProfile = {"first_name": "", "last_name": "", "username": ""}
  username: string = "";

  constructor(public dialog: MatDialog,
     private httpClient: HttpClient) {}

  ngOnInit(){
    const token_value = localStorage.getItem('tokens')
    console.log("on it token info");
    if (token_value != null) {
      const data = JSON.parse(token_value);
      console.log(data.access)
      let headers = new HttpHeaders();
      headers = headers.append( 'Content-Type', 'application/json'),
      headers = headers.append( "Authorization", 'Bearer ' + data.access )
      this.httpClient.get('http://localhost:8000/api/validatetoken/', {headers: headers, observe: "response"}).subscribe(data => {
        console.log(data);
        if (data.status == 200){
          this.is_logged=true;
          const user_name: string | null = localStorage.getItem('username')
          if (user_name){
            this.username = user_name
          }
        }

      })
        
    }
  }

  LoginDialog() {
    const dialogRef = this.dialog.open(LoginModalComponent, {data: this.user_data});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.username = result.data.username;
      this.is_logged=true;
    });
  }

  logout(){
    localStorage.clear();
    this.is_logged=false;
  }

}

export interface UserProfile {
  username: string;
  first_name: string;
  last_name: string;
}