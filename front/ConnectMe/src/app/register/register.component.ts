import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { registerUser } from '../Model/registerUser';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    fname: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    lname: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    adress: new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
    ]),
    mobile: new FormControl('', [
      Validators.required,
      Validators.maxLength(15),
    ]),
    image: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    imp1: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    imp2: new FormControl('', [Validators.required, Validators.maxLength(15)]),
  });
  hasError: boolean = false;
  errommsg = '';
  uname = '';
  res: boolean = false;
  constructor(private general: GeneralService) {}

  ngOnInit() {
    this.hasError = false;
    this.errommsg = '';
  }

  onFormSubmit() {
    this.hasError = false;
    this.errommsg = '';

    if (
      this.registerForm.get('imp1').value == this.registerForm.get('imp2').value
    ) {
      let data: registerUser = {
        name: this.registerForm.get('name').value,
        fname: this.registerForm.get('fname').value,
        lname: this.registerForm.get('lname').value,
        adress: this.registerForm.get('adress').value,
        mobile: this.registerForm.get('mobile').value,
        image: this.registerForm.get('image').value,
        imp: this.registerForm.get('imp1').value,
      };
      console.log(data);
      this.general.register(data).subscribe(
        (suc) => {
          this.uname = suc.name;
          this.registerForm.reset({
            name: '',
            fname: '',
            lname: '',
            adress: '',
            mobile: '',
            image: '',
            imp: '',
          });
          this.res = suc.result;
        },
        (err) => {
          console.log(err);
          this.errommsg = JSON.stringify(err);
          this.hasError = true;
        }
      );
    } else {
      this.hasError = true;
      this.errommsg = 'password mis matched';
    }
  }
}
