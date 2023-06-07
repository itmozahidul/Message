import { Component, OnInit } from '@angular/core';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { GeneralService } from '../service/general.service';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
@Component({
  selector: 'app-record-audio',
  templateUrl: './record-audio.component.html',
  styleUrls: ['./record-audio.component.scss'],
})
export class RecordAudioComponent implements OnInit {
  path = '../../assets/temp.mp3';
  status = 'off';
  file: MediaObject;
  constructor(
    public media: Media,
    private generalService: GeneralService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.record();
  }

  cancel() {}
  send() {}
  play() {}
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
