import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GeneralService } from '../service/general.service';
import { Capacitor } from '@capacitor/core';
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

  audio: HTMLAudioElement;

  audioChunks = [];
  rec: MediaRecorder;
  aud_src;

  reciever: string = null;
  reciever$: Observable<string>;

  @Output() onCancel = new EventEmitter<any>();

  constructor(
    private store: Store<State>,
    private generalService: GeneralService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalController: ModalController
  ) {
    this.reciever$ = this.store.select(selector.selectCurrentReciever);
  }

  ngOnInit() {
    this.recordstart();
    this.reciever$.subscribe((reciever_name) => {
      this.reciever = reciever_name;
    });
  }

  recordstart() {
    if (Capacitor.isNativePlatform()) {
      this.record();
    } else {
      this.record2();
    }
  }

  loadingEnd() {
    console.log('loading ended');

    /* setTimeout(() => {
      
    }, 3000); */
    try {
      this.loadingCtrl.dismiss().then(
        (suc) => {
          console.log(suc);
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  cancel() {
    console.log('canceled');
    this.status = 'off';
    this.rec.ondataavailable = null;
    this.rec.stream.getTracks().forEach((t) => {
      t.stop();
    });
    this.onCancel.emit();
  }
  send() {
    this.rec.stop();
    this.onCancel.emit();
  }

  sendFileToback(data) {
    if (
      data != null &&
      this.reciever != '' &&
      this.generalService.getUser() != ''
    ) {
      let newMsg = new chatResponse(
        -1111,
        '00.00',
        1,
        0,
        '',
        false,
        this.generalService.getUser(),
        this.reciever
      );
      newMsg.data = data;
      newMsg.type = 'audio';
      this.generalService.sendMessage(newMsg);
    } else {
      throw new Error('Audio or reciever or sender might be empty');
    }
  }
  play() {
    this.audio.play;
  }

  record2() {
    window.navigator.mediaDevices.getUserMedia({ audio: true }).then(
      (s) => {
        console.log('stream is found');
        console.log(s);
        this.status = 'on';
        this.handlerFunction(s);
      },
      (f) => {
        console.log('stream is not found');
        console.log(f);
        this.status = 'off';
        this.generalService.loading_notification_short_hoover(
          'Device is not compitable'
        );
        this.cancel();
      }
    );
  }

  handlerFunction(stream) {
    console.log('in handlerFunction ');
    this.rec = new MediaRecorder(stream);
    this.rec.start();
    this.rec.ondataavailable = (e: BlobEvent) => {
      console.log(e);
      this.audioChunks.push(e.data);
      console.log(this.rec);
      if (this.rec.state == 'inactive' && this.rec.stream.active == true) {
        const blob = new Blob(this.audioChunks, { type: 'audio/mp3' });
        const file = new File(
          [blob],
          this.generalService.getUser() + '_' + this.reciever + 'audio.mp3',
          { type: 'audio/mp3' }
        );
        this.sendFile(file, this.generalService.recordSendMessage());
        this.rec.stream.getTracks().forEach((t) => {
          t.stop();
        });
      }
    };
  }
  record() {
    this.record2();
    /* this.file = this.media.create(this.path);
    this.file.startRecord();
    this.status = 'on'; */
  }

  sendAudioFileToback(data, name) {
    if (
      data != null &&
      this.reciever != '' &&
      this.generalService.getUser() != ''
    ) {
      let newMsg = new chatResponse(
        -1111,
        '00.00',
        1,
        0,
        name,
        false,
        this.generalService.getUser(),
        this.reciever
      );
      newMsg.chatid = this.generalService.getFromLocal(
        this.generalService.currentchatid
      );
      newMsg.data = data;
      newMsg.type = 'audio';
      this.generalService.sendMessage(newMsg);
    } else {
      throw new Error('Audio or reciever or sender might be empty');
    }
  }

  sendFile(file, filename) {
    const bucket: FormData = new FormData();
    bucket.append('file', file);
    bucket.append('name', filename);
    this.generalService.sendFileWithoutWebSocket(bucket).subscribe(
      (suc) => {
        this.sendAudioFileToback(suc.path, filename);
      },
      (err) => {
        this.generalService.loading_notification_short_hoover(
          'Failed to upload ' + filename
        );
      }
    );
  }
}
