import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent {

  hide = true;
  loginForm: LoginModel = {
    username: '',
    password: ''
  }

  signupForm: signupModel = {
    username: '',
    passwordone: '',
    passwordtwo: ''
  }

 constructor(
        public dialogRef: MatDialogRef<LoginModalComponent>,
        private httpClient: HttpClient,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: UserProfile,
       ) {}

 userLogin(payload: LoginModel){
    console.log(payload);
    console.log(payload['username']);
    var formData: any = new FormData();
    formData.append('username', payload['username']);
    formData.append('password', payload['password']);
    return this.httpClient.post('http://localhost:8000/api/log_in/', formData).pipe(map((data) => {
          
          var token = data as TokenModel;
          localStorage.setItem('tokens', JSON.stringify(token));
          var userInfo = this.jwtService.decodeToken( token.access ) as UserProfile;
          this.userProfile.next(userInfo);
          this.data["username"] = userInfo.username;
          localStorage.setItem('username', userInfo.username);
          this.dialogRef.close({data: this.data});
          // this.data = {"first_name": "kunafn", "last_name": "kunln", "username": "kunausr"};
          return true;
        }),
      catchError((error) => {
        console.log(error);
        return of(false);
      })
    );
  }

  signup(payload: signupModel){
    var formData: any = new FormData();
    formData.append('username', payload['username']);
    formData.append('password1', payload['passwordone']);
    formData.append('password2', payload['passwordtwo']);
    formData.append('frist_name', payload['username']);
    formData.append('last_name', payload['username']);
    

    this.httpClient.post('http://localhost:8000/api/sign_up/', formData).subscribe((data) => {
      console.log(data);
      this._snackBar.open( JSON.stringify(data), "success");
      this.dialogRef.close();
    })
  }


 userProfile = new BehaviorSubject<UserProfile | null>(null);
 jwtService: JwtHelperService = new JwtHelperService();

 login(event: LoginModel){
    this.userLogin(event).subscribe((data) => {
      if (data) {
        console.log("user logged in");
      }
    });
  }


  googlesign(){
    console.log("user google log in");
  }
}

export interface LoginModel {
  username: string;
  password: string;
}

export interface signupModel {
  username: string;
  passwordone: string;
  passwordtwo: string;
}

export interface TokenModel {
  access: string;
  refresh: string;
}

export interface UserProfile {
  username: string;
  first_name: string;
  last_name: string;
}
