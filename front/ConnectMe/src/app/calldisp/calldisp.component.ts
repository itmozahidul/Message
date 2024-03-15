import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Location } from '@angular/common';
import { MaxLengthValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { chatResponse } from '../DTO/chatResponse';
import { Message } from '../model/message';
import { GeneralService } from '../service/general.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { State } from '../store/reducer';
import * as selector from '../store/selector';
import * as action from '../store/action';
import { Capacitor } from '@capacitor/core';
import {
  ActionSheetController,
  IonContent,
  IonInfiniteScroll,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { SelectImageComponent } from '../select-image/select-image.component';

import { RecordAudioComponent } from '../record-audio/record-audio.component';
import { NewFriendComponent } from '../new-friend/new-friend.component';
import { Chathead } from '../DTO/chatHead';

@Component({
  selector: 'app-calldisp',
  templateUrl: './calldisp.component.html',
  styleUrls: ['./calldisp.component.scss'],
})
export class CalldispComponent implements OnInit {
  ansr: string;
  ansr$: Observable<string>;
  callingurl = 'assets/video/calling.mp4';
  calling = false;
  subscriptionList: Subscription[] = [];
  talker = '';

  constructor(
    private store: Store<State>,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private generalService: GeneralService,
    private http: HttpClient,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public location: Location
  ) {
    this.ansr$ = this.store.select(selector.selectansr);
  }
  unsub_subs() {
    this.subscriptionList.forEach((s) => {
      s.unsubscribe;
    });
    this.subscriptionList.forEach((s) => {
      this.subscriptionList.pop();
    });
  }

  ngOnInit() {
    this.subscreib_router();
    this.subscreib_ansr();
  }

  subscreib_router() {
    //debugger;
    this.activatedroute.paramMap.subscribe((params) => {
      this.store.dispatch(action.updateansr({ ansr: '' }));
      let d = params.get('user');
      if (d != '') {
        console.log(
          '##########################################################'
        );
        console.log(
          '##################### calling  ' + d + '#######################'
        );
        console.log(
          '##########################################################'
        );
        this.makecall(d);
      } else {
        this.sendCallendMessage(1, this.talker, 'end');

        this.call_canceled('me');
      }
    });
  }

  subscreib_ansr() {
    this.subscriptionList.push(
      this.ansr$.subscribe((s) => {
        if (this.calling) {
          this.ansr = s;
          if (s != '' && s != this.generalService.call_cancelled) {
            this.router.navigate(['/call', s]);
            this.call_canceled('other');
            this.store.dispatch(action.updateansr({ ansr: '' }));
          } else if (s == this.generalService.call_cancelled) {
            this.call_canceled('me');
            this.store.dispatch(action.updateansr({ ansr: '' }));
          }
        }
      })
    );
  }

  makecall(s) {
    this.calling = true;
    this.talker = s;
    console.log('##########   clicked to call');
    s =
      s == ''
        ? this.generalService.getFromLocal(
            this.generalService.currentrecieverlocal
          )
        : s;
    let cr: chatResponse = new chatResponse(
      -1111,
      '',
      1,
      0,
      this.generalService.getUser(),
      true,
      this.generalService.getUser(),
      s
    );
    this.generalService.sendMessage2(cr, 'call');
    setTimeout(() => {
      if ((this.calling = true)) {
        this.sendCallendMessage(1, this.talker, 'end');
        this.call_canceled('me');
      }
    }, this.generalService.waiting_time);
    //this.router.navigate(['/call', s]);
  }

  call_canceledFront() {
    this.sendCallendMessage(1, this.talker, 'end');

    this.call_canceled('me');
  }

  call_canceled(mode) {
    if (this.calling) {
      this.unsub_subs();
      if (mode == 'me') {
        this.location.back();
      }
      this.calling = false;
    }
  }

  sendCallendMessage(text, rcv, type) {
    if (
      text != null &&
      text != '' &&
      rcv != '' &&
      type != '' &&
      this.generalService.getUser() != ''
    ) {
      let newMsge = new chatResponse(
        -1111,
        '00.00',
        1,
        0,
        text,
        false,
        this.generalService.getUser(),
        rcv
      );
      this.generalService.sendMessage2(newMsge, type);
    } else {
      console.log('Reciever or sender or text or type was empty');
      this.location.back();
    }
  }
}
