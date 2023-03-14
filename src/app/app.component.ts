import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

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

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(){
  }

   firstFormGroup = this._formBuilder.group({
       firstCtrl: ['', Validators.required],
        });
   secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });


  onSubmit(event: any) {
    console.log("Form Submitted!");
    console.log(event)
  }
}
