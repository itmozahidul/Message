import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { loginUser } from '../model/loginUser';
import { registerUser } from '../model/registerUser';
import { GeneralService } from '../service/general.service';
import { Store } from '@ngrx/store';
import { State } from '../store/reducer';
import * as selector from '../store/selector';
import * as action from '../store/action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    adress: new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
    ]),
    imp: new FormControl('', [Validators.required, Validators.maxLength(15)]),
  });
  errommsg: string = '';
  hasError: boolean = false;
  constructor(
    private general: GeneralService,
    private router: Router,
    private store: Store<State>
  ) {}

  ngOnInit() {
    console.log('in login ngoninit');
    console.log(this.general.isTokenExpired());

    try {
      if (!this.general.isTokenExpired()) {
        if (this.general.getUser().length > 0) {
          this.router.navigate(['chat']);
        }
      }
    } catch (error) {
      this.general.logout();
    }
  }

  onFormSubmit() {
    this.general.showBusy();
    if (this.loginForm.get('adress').value == '') {
      this.hasError = true;
      if (this.loginForm.get('imp').value == '') {
        this.errommsg = 'Input can not be empty!';
      } else {
        this.errommsg = 'Username is empty!';
      }
      this.general.endBusy();
    } else if (this.loginForm.get('imp').value == '') {
      this.hasError = true;
      this.errommsg = 'Password is empty!';

      this.general.endBusy();
    } else {
      this.hasError = false;
      this.errommsg = '';
      let data: loginUser = {
        adress: this.loginForm.get('adress').value,
        imp: this.loginForm.get('imp').value,
      };
      this.general.login(data).subscribe(
        (suc) => {
          this.general.endBusy();
          if (suc.jwt != '' && suc.jwt != null) {
            if (this.general.prepareSession(suc.jwt)) {
              //this.router.navigate(['chat']);
              this.store.dispatch(
                action.updateurrentUser({ currentUser: this.general.getUser() })
              );
              let nimage: string = '';
              try {
                let temp_user = this.general.getUser();
                this.general.getUserPhoto(temp_user).subscribe(
                  (succ) => {
                    if (succ[0].length > 0) {
                      nimage = succ[0];
                      this.store.dispatch(
                        action.updateUserImage({ image: nimage })
                      );
                    } else {
                      nimage = 'assets/avatar.png';
                    }
                  },
                  (errr) => {
                    console.log(errr);
                    nimage = 'assets/avatar.png';
                  }
                );
              } catch (error) {
                console.log(error);
                nimage = 'assets/avatar.png';
              }

              this.general.connect().then(
                (suc) => {
                  console.log(suc);
                  this.router.navigate(['/chat', '']);
                },
                (err) => {
                  console.log(err);
                }
              );
              this.general.connectWebrtc().then(
                (suc) => {
                  console.log(suc);
                },
                (err) => {
                  console.log(err);
                }
              );
            } else {
              console.log('ERROR from backend');
              this.errommsg = 'Incorrect credentials!';
              this.hasError = true;
            }
          } else {
            console.log('no token was found');
            this.errommsg = 'Incorrect credentials!';
            this.hasError = true;
          }
        },
        (err) => {
          this.general.endBusy();
          console.log(err);
          this.errommsg = 'Network Error !';
          this.hasError = true;
        }
      );
    }
  }
}
