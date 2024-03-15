import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GeneralService } from '../service/general.service';
import { State } from '../store/reducer';
import * as selector from '../store/selector';
import * as action from '../store/action';
import { chatResponse } from '../DTO/chatResponse';
import { dispatch } from 'rxjs/internal/observable/pairs';

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
  call: string = '';
  call$: Observable<string>;
  callend: number = 0;
  callend$: Observable<number>;
  id_v_el = 'id_v_el';
  id_ion_g_el = 'id_ion_g_el';
  temp_v = null;
  temp_g = null;

  callingurl = 'assets/video/calling.mp4';
  constructor(
    private store: Store<State>,
    private router: Router,
    private generalService: GeneralService
  ) {
    this.currrentUser$ = this.store.select(selector.selectCurrentUser);
    this.image$ = this.store.select(selector.selectUserImage);
    this.call$ = this.store.select(selector.selectCall);
    this.callend$ = this.store.select(selector.selectCallend);
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
    this.subscreib_call();

    this.subscreibcallend();
  }

  subscreib_call() {
    this.subscriptionList.push(
      this.call$.subscribe((s) => {
        this.call = s;

        if (s != '') {
          this.take_reply_to_call(
            this.id_v_el,
            this.id_ion_g_el,
            this.callingurl,
            this.generalService.waiting_time
          );
        }
      })
    );
  }

  subscreibcallend() {
    this.subscriptionList.push(
      this.callend$.subscribe((d) => {
        this.callend = d;

        if (d == 1) {
          this.cancel_call(0);
          this.store.dispatch(action.updateCallend({ callend: 0 }));
        }
      })
    );
  }

  take_reply_to_call(id_v, id_g, url, waiting_time) {
    let vl: HTMLVideoElement = document.createElement('video');
    this.temp_v = vl;
    vl.setAttribute('id', id_v);
    vl.setAttribute(
      'style',
      'position: absolute;background:black;width: 100vw;height: 100vh;'
    );
    vl.autoplay = true;

    let vls = document.createElement('source');
    vls.src = url;

    vl.appendChild(vls);

    let i_g = document.createElement('ion-grid');
    this.temp_g = i_g;
    i_g.setAttribute('id', id_g);
    i_g.setAttribute(
      'style',
      'margin-top: 90vh;height: 10vh;text-align: center;'
    );

    let i_r = document.createElement('ion-row');
    i_r.setAttribute('size', '12');

    let i_c1 = document.createElement('ion-col');
    i_c1.setAttribute('size', '4');
    let i_b1 = document.createElement('ion-button');
    i_b1.setAttribute('id', 'answer_call_ok');
    i_b1.innerHTML = 'Accept';
    i_b1.addEventListener('click', () => {
      i_g.remove();
      vl.remove();
      this.answer_call();
    });
    i_c1.appendChild(i_b1);

    let i_c2 = document.createElement('ion-col');
    i_c2.setAttribute('size', '4');

    let i_c3 = document.createElement('ion-col');
    i_c3.setAttribute('size', '4');
    let i_b2 = document.createElement('ion-button');
    i_b2.setAttribute('id', 'answer_call_cancel');
    i_b2.innerHTML = 'Cancel';
    i_b2.addEventListener('click', () => {
      i_g.remove();
      vl.remove();
      this.cancel_call_front();
    });
    i_c3.appendChild(i_b2);

    i_r.appendChild(i_c1);
    i_r.appendChild(i_c2);
    i_r.appendChild(i_c3);

    i_g.appendChild(i_r);

    document.body.appendChild(vl);
    document.body.appendChild(i_g);
    /*document.body.insertBefore(i_g, document.body.firstChild);
    document.body.insertBefore(vl, document.body.firstChild); */

    setTimeout(() => {
      i_g.remove();
      vl.remove();
      this.cancel_call(1);
    }, waiting_time);
  }

  cancel_call_front() {
    let cr: chatResponse = new chatResponse(
      -1111,
      '',
      1,
      0,
      this.generalService.call_cancelled,
      true,
      this.generalService.getUser(),
      this.call
    );
    this.generalService.sendMessage2(cr, 'ansr');
    this.cancel_call(1);
  }

  cancel_call(mode) {
    if (mode == 0) {
      try {
        this.temp_g.remove();
        this.temp_v.remove();
      } catch (error) {
        console.log(error);
      }
    }

    /* if (mode == 2) {
      let cr2: chatResponse = new chatResponse(
        -1111,
        '',
        1,
        0,
        this.generalService.call_cancelled,
        true,
        this.generalService.getUser(),
        this.call
      ); 
      this.generalService.sendMessage2(cr, 'missed');
    }*/
    this.store.dispatch(action.updateCall({ call: '' }));
  }

  answer_call() {
    if (this.call != '') {
      let cr: chatResponse = new chatResponse(
        -1111,
        '',
        1,
        0,
        this.generalService.getUser(),
        true,
        this.generalService.getUser(),
        this.call
      );

      this.router.navigate(['/call', this.call]);
      setTimeout(() => {
        this.generalService.sendMessage2(cr, 'ansr');
        this.store.dispatch(action.updateCall({ call: '' }));
      }, 1000);
    }
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
