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
import { act } from '@ngrx/effects';

@Component({
  selector: 'app-mecalldisp',
  templateUrl: './mecalldisp.component.html',
  styleUrls: ['./mecalldisp.component.scss'],
})
export class MecalldispComponent implements OnInit, OnDestroy {
  callingto: string = '';
  callingto$: Observable<string>;
  callingurl = 'assets/video/calling.mp4';
  image: string = 'assets/avatar.png';

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
    this.callingto$ = this.store.select(selector.selecttalkingpartner);
  }
  ngOnDestroy(): void {
    console.log('destroying webrtc call component...');
  }

  ngOnInit() {
    this.sub_talking_partner();
  }

  sub_talking_partner() {
    this.callingto$.subscribe((p) => {
      if (p != '') {
        this.callingto = p;
        this.load_reciever_image(p);
      }
    });
  }

  call_canceled_me() {
    this.store.dispatch(
      action.updateCall({
        call:
          this.generalService.call_cancelled_me +
          this.generalService.separator +
          this.callingto +
          this.generalService.separator +
          'me',
      })
    );
    this.store.dispatch(action.updatetalkingpartner({ talkingpartner: '' }));
  }

  load_reciever_image(rsvr) {
    let nimage: string = '';
    this.generalService.getUserPhoto(rsvr).subscribe(
      (suc) => {
        if (suc[0].length > 0) {
          this.image = suc[0];
        } else {
          this.image = 'assets/avatar.png';
        }
      },
      (err) => {
        console.log(err);
        this.image = 'assets/avatar.png';
      }
    );
  }
}
