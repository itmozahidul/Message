import { Component, OnInit } from '@angular/core';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { GeneralService } from '../service/general.service';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { chatResponse } from '../DTO/chatResponse';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../store/reducer';
import * as selector from '../store/selector';
import * as action from '../store/action';
@Component({
  selector: 'app-record-audio',
  templateUrl: './record-audio.component.html',
  styleUrls: ['./record-audio.component.scss'],
})
export class RecordAudioComponent implements OnInit {
  path = '../../assets/temp.mp3';
  status = 'off';
  file: MediaObject;

  reciever: string = null;
  reciever$: Observable<string>;
  constructor(
    private store: Store<State>,
    public media: Media,
    private generalService: GeneralService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalController: ModalController
  ) {
    this.reciever$ = this.store.select(selector.selectCurrentReciever);
  }

  ngOnInit() {
    this.record();
  }

  cancel() {
    this.modalController.dismiss();
  }
  send() {
    console.log(this.file);
    //this.generalService.sendMessage();
  }
  sendFileToback(data) {
    if (data != null) {
      let newMsg = new chatResponse(
        -1111,
        '00.00',
        '',
        false,
        this.generalService.getUser(),
        this.reciever
      );
      newMsg.data = data;
      newMsg.type = 'audio';
      this.generalService.sendMessage(newMsg);
      this.cancel();
    }
  }
  play() {
    this.file.play;
  }
  reset() {
    this.stop();
    this.record();
  }
  record() {
    this.file = this.media.create(this.path);
    this.file.startRecord();
    this.status = 'on';
  }
  pause() {
    this.file.pauseRecord();
    this.status = 'pause';
  }
  resume() {
    this.file.resumeRecord();
    this.status = 'on';
  }
  stop() {
    this.file.stopRecord();
    this.status = 'off';
  }
}
