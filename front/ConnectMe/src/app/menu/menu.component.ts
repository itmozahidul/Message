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
import {
  ActionSheetController,
  IonContent,
  IonInfiniteScroll,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { CalldispComponent } from '../calldisp/calldisp.component';
import { MecalldispComponent } from '../mecalldisp/mecalldisp.component';
import { OthercalldispComponent } from '../othercalldisp/othercalldisp.component';
import { TestComponent } from '../test/test.component';

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
    private generalService: GeneralService,
    public modalController: ModalController
  ) {
    this.currrentUser$ = this.store.select(selector.selectCurrentUser);
    this.image$ = this.store.select(selector.selectUserImage);
    this.call$ = this.store.select(selector.selectCall);
  }

  ngOnInit() {
    this.sub_currentuser();
    this.sub_currentuserImage();
    this.subscreib_call();
  }

  sub_currentuserImage() {
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

  sub_currentuser() {
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
  }

  subscreib_call() {
    this.subscriptionList.push(
      this.call$.subscribe(async (s) => {
        this.call = s;
        console.log('in menu component trigering modal');
        if (s != '') {
          try {
            if (s == 'cancel_me|-|') {
              //debugger;
            }

            await this.handel_call_data(s);
          } catch (error) {
            this.reset_calling_value();
            this.modalController.dismiss();
          }

          /* this.take_reply_to_call(
            this.id_v_el,
            this.id_ion_g_el,
            this.callingurl,
            this.generalService.waiting_time
          ); */
        }
      })
    );
  }
  reset_calling_value() {
    this.store.dispatch(action.updateCall({ call: '' }));
  }

  async endModeal() {
    await this.modalController.dismiss({
      dismissed: true,
    });
    //await this.loadingStart('loading...');
  }

  async handel_call_data(data: string) {
    let datas: string[] = data.split(this.generalService.separator);
    if (datas.length > 1) {
      let key = datas[0];
      let person = datas[1];
      switch (key) {
        case this.generalService.call_started_me:
          await this.call_started_me_f(person);
          break;
        case this.generalService.call_started_other:
          await this.call_started_other_f(person);
          break;
        case this.generalService.call_answered_me:
          this.call_answered_me_f(person);
          break;
        case this.generalService.call_answered_other:
          this.call_answered_other(person);
          break;
        case this.generalService.call_cancelled_me:
          this.call_cancelled_me_f(person);
          break;
        case this.generalService.call_cancelled_other:
          this.call_cancelled_other_f(person);
          break;
        default:
          break;
      }
    } else {
      throw new Error(
        'calling data were not correct , there was no proper separation between user and call data text'
      );
    }
  }

  async call_started_me_f(p: string) {
    this.generalService.sendWebrtcCallMessage(
      this.generalService.call_started_other +
        this.generalService.separator +
        this.generalService.getUser(),
      p,
      'call'
    );
    this.store.dispatch(action.updatetalkingpartner({ talkingpartner: p }));
    await this.presentCallMeDispModal();
  }
  async presentCallMeDispModal() {
    const modal = await this.modalController.create({
      component: MecalldispComponent,
      backdropDismiss: false,
    });
    return await modal.present();
  }
  async call_started_other_f(p: string) {
    console.log(p + ' is calling you');
    this.store.dispatch(action.updatetalkingpartnero({ talkingpartnero: p }));
    await this.presentOtherCallDispModal();
  }
  async presentOtherCallDispModal() {
    const modal = await this.modalController.create({
      component: OthercalldispComponent,
      backdropDismiss: false,
    });
    return await modal.present();
  }
  async call_answered_me_f(p: string) {
    this.generalService.sendWebrtcCallMessage(
      this.generalService.call_answered_other +
        this.generalService.separator +
        this.generalService.getUser(),
      p,
      'call'
    );
    await this.endModeal();
    await this.presentOtherIncallModal(p);
  }
  async presentOtherIncallModal(caller: string) {
    let talker = 'talker';
    const modal = await this.modalController.create({
      component: TestComponent,
      backdropDismiss: false,
      componentProps: {
        talker: caller,
      },
    });
    return await modal.present();
  }
  async call_answered_other(p: string) {
    await this.endModeal();
    await this.presentOtherIncallModal(p);
  }
  call_cancelled_me_f(p: string) {
    this.generalService.sendWebrtcCallMessage(
      this.generalService.call_cancelled_other +
        this.generalService.separator +
        this.generalService.getUser(),
      p,
      'call'
    );
    this.endModeal();
  }
  call_cancelled_other_f(p: string) {
    console.log(p + ' canceled the call');
    this.store.dispatch(
      action.updategotocallwith({
        gotocallwith: this.generalService.call_cancelled_other,
      })
    );
    this.endModeal();
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
