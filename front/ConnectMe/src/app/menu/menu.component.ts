import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GeneralService } from '../service/general.service';
import { State } from '../store/reducer';
import * as selector from '../store/selector';
import * as action from '../store/action';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  currentUser: string = '';
  subscriptionList: any[] = [];
  image: string = 'assets/avatar.png';
  image$: Observable<string>;
  currrentUser$: Observable<string>;
  constructor(
    private store: Store<State>,
    private router: Router,
    private generalService: GeneralService
  ) {
    this.currrentUser$ = this.store.select(selector.selectCurrentUser);
    this.image$ = this.store.select(selector.selectUserImage);
  }

  ngOnInit() {
    this.subscriptionList.push(
      this.currrentUser$.subscribe((s) => {
        if (s == '') {
          let temp_user = this.generalService.getUser();
          if (temp_user == '') {
            this.router.navigate(['login']);
          } else {
            this.currentUser = temp_user;
            this.store.dispatch(
              action.updateurrentUser({ currentUser: temp_user })
            );
          }
        } else {
          this.currentUser = s;
        }
      })
    );
    this.subscriptionList.push(
      this.image$.subscribe((s) => {
        if (s == '') {
          let nimage: string = '';
          this.generalService
            .getUserPhoto(this.generalService.getUser())
            .subscribe(
              (suc) => {
                if (suc[0].length > 0) {
                  nimage = suc[0];
                } else {
                  nimage = 'assets/avatar.png';
                }
                this.store.dispatch(action.updateUserImage({ image: nimage })); //from backend image comes as an array
              },
              (err) => {
                console.log(err);
                this.image = 'assets/avatar.png';
              }
            );
        } else {
          this.image = s;
        }
      })
    );
  }

  logout() {
    this.generalService.disConnect().then(
      (suc) => {
        this.router.navigate(['login']);
      },
      (fail) => {
        console.log('not loged out');
        console.log(fail);
      }
    );
  }

  gotoSetting() {
    this.router.navigate(['setting']);
  }
  gotoProfile() {
    this.router.navigate(['profile']);
  }
  gotoChat() {
    this.router.navigate(['chat']);
  }
}
