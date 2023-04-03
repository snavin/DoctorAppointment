import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {NgForm} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
})
export class AppComponent {
  title = 'doctor-app';
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
  doctorslist: doctor[] = [];
  doctorssearchlist: doctor[] = [];
  userdetails: user[] = [{"name": "kuna", "country": "india"}];
  displayedColumns: string[] = ['name', 'specality', 'date', 'time', 'cancel'];
  dataSource: appointment_if[] = [];
  doctor_search_input: string = "";
  doctor_search_status: boolean = false;
  isLinear = false;
  appointment_list_status: boolean = false;
  current_session_data: current_session_data = {"date": "", "speciality": "", "time": ""};

 
  constructor(private _formBuilder: FormBuilder,
              public httpClient: HttpClient,
              private _snackBar: MatSnackBar) {}
  

  ngOnInit(){
    
  }

   firstFormGroup = this._formBuilder.group({
       firstCtrl: ['', Validators.required],
        });
   secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  
  doctorSearch(){
    console.log(this.doctor_search_input);
    if (this.doctor_search_input != ""){
      this.doctorssearchlist = this.doctorslist.filter(p => p.name.includes(this.doctor_search_input));
      this.doctor_search_status = true;
    } else {
      this.doctor_search_status = false;
      console.log(this.doctor_search_status);
    }
    
  }

  onSubmit(event: NgForm) {
    console.log("Form Submitted!");
    console.log(event.value);
    this.doctorslist = []
    this.current_session_data = {"date": event.value['date'], "speciality": event.value['specality'], "time":event.value['timings']}

    const token_value = localStorage.getItem('tokens')
    console.log("on it token info");
    if (token_value != null) {
      const data = JSON.parse(token_value);
      console.log(data.access)
      let headers = new HttpHeaders();
      headers = headers.append( "Authorization", 'Bearer ' + data.access )

      var formData: any = new FormData();
      formData.append('specality', event.value['specality']);
      formData.append('timings', event.value['timings']);
      formData.append('date', event.value['date']);
   
      console.log("list_doctors");

      this.httpClient.post<doctor_http>('http://localhost:8000/api/listdoctors/', formData, {headers: headers}).subscribe((data_http: doctor_http) =>  {
        
        for (let i = 0; i < data_http.data.length ; i++){
          this.doctorslist.push(data_http.data[i]);
        }
        console.log(this.doctorslist)
      })
    } else {
      this._snackBar.open( "User not logged in", "failed");
    }
  }

  

  bookappointment(event: any){
    const token_value = localStorage.getItem('tokens')
    if (token_value != null) {
      const data = JSON.parse(token_value);
      console.log(data.access)
      let headers = new HttpHeaders();
      headers = headers.append( "Authorization", 'Bearer ' + data.access )
  
      var formData: any = new FormData();
      formData.append('timings', this.current_session_data.time);
      formData.append('date', this.current_session_data.date);
      formData.append('doctor_id', event);
  
      this.httpClient.post('http://localhost:8000/api/createappointment/', formData, {headers: headers}).subscribe((data) =>  {
        this._snackBar.open( JSON.stringify(data), "success");
        console.log(data);
        this.getappointment();
      })
    } else {
      this._snackBar.open( "User not logged in", "failed");
    }
  }

  getappointment(){
    this.appointment_list_status = false;
    const token_value = localStorage.getItem('tokens')
    this.dataSource = [];
    if (token_value != null) {
      const data = JSON.parse(token_value);
      console.log(data.access)
      let headers = new HttpHeaders();
      headers = headers.append( "Authorization", 'Bearer ' + data.access )
  
      this.httpClient.get<appointment_session_data>('http://localhost:8000/api/getappointment/', {headers: headers}).subscribe((data:appointment_session_data) => {
        console.log(data.data);
        for (let i = 0; i < data.data.length ; i++){
          this.dataSource.push(data.data[i]);
        }
        this.appointment_list_status = true;
      })
    } else {
      this._snackBar.open( "User not logged in", "failed");
    }
  }

  selectionAppointment(event: any){
    if (event.selectedIndex == 2){
      this.getappointment();
      console.log(this.dataSource)
    }
  }

  deleteappointment(event: string){
    const token_value = localStorage.getItem('tokens')
    this.appointment_list_status = false;
    if (token_value != null) {
      const data = JSON.parse(token_value);
      console.log(data.access)
      let headers = new HttpHeaders();
      headers = headers.append( "Authorization", 'Bearer ' + data.access )

      var formData: any = new FormData();
      formData.append('id', event);

      this.httpClient.post('http://localhost:8000/api/deleteappointment/', formData, {headers: headers}).subscribe((data) =>  {
        this._snackBar.open( JSON.stringify(data), "success");
        this.getappointment();
        })
    } else {
      this._snackBar.open( "User not logged in", "failed");
    }
  }

}
export interface user {
  name: string;
  country: string;
}

export interface doctor_http {
  data: doctor[];
}
export interface doctor {
  name: string;
  speciality: string;
  id: string;
  // id: string;
}

export interface current_session_data {
  speciality: string;
  date: string;
  time: string;
}

export interface appointment_session_data {
  data: appointment_if[];
}

export interface appointment_if {
  name: string;
  speciality: string;
  date: string;
  time: string;
  id: string;
}