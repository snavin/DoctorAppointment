import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {NgForm} from '@angular/forms';

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
  doctorslist: string[] = ["naveen", "naveen_dup"];
  userdetails: user[] = [{"name": "kuna", "country": "india"}];
  displayedColumns: string[] = ['name', 'specality', 'date', 'time', 'cancel'];
  dataSource = doctordetails;
 
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(){
  }

   firstFormGroup = this._formBuilder.group({
       firstCtrl: ['', Validators.required],
        });
   secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });


  onSubmit(event: NgForm) {
    console.log("Form Submitted!");
    console.log(event.value);
  }
}
export interface user {
  name: string;
  country: string;
}
export interface doctor {
  name: string;
  specialist: string;
  date: string;
  time: string;
}
const doctordetails: doctor[] = [
  {name: 'Hydrogen', specialist: 'bones', date: '13-02-2023', time: "13:20"},
];