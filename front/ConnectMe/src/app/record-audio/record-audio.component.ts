import { Component, OnInit } from '@angular/core';
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
  rec;
  aud_src;

  reciever: string = null;
  reciever$: Observable<string>;

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
    if (Capacitor.isNativePlatform()) {
      this.record();
    } else {
      this.record2();
    }
    this.reciever$.subscribe((reciever_name) => {
      this.reciever = reciever_name;
    });
  }

  cancel() {
    this.modalController.dismiss();
  }
  send() {
    this.stop();
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
    this.audio.play;
  }
  reset() {
    this.stop();
    this.record();
  }
  record2() {
    window.navigator.mediaDevices.getUserMedia({ audio: true }).then(
      (s) => {
        console.log('stream is found');
        console.log(s);
        this.handlerFunction(s);
      },
      (f) => {
        console.log('stream is not found');
        console.log(f);
        this.generalService.loading_notification_short_hoover(
          'Device is not compitable'
        );
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
      if (this.rec.state == 'inactive') {
        let blob = new Blob(this.audioChunks, { type: 'audio/mp3' });

        this.audio = new Audio(URL.createObjectURL(blob));
        this.generalService.blobToBase64(blob).then(
          (base64data) => {
            console.log('success');
            this.aud_src = base64data;
            this.sendFileToback(this.aud_src);
          },
          (f) => {
            console.log('failed');
            this.generalService.loading_notification_short_hoover(
              'Voice message failed'
            );
          }
        );

        /*  if (Capacitor.isNativePlatform()) {
          
        } else {
          var reader = new FileReader();

          reader.readAsDataURL(blob);
          console.log(reader.result);
          reader.onloadend = () => {
            console.log('inside');
            let base64data = reader.result;
            this.aud_src = base64data;
            this.sendFileToback(this.aud_src);
          };
        } */
      }
    };
  }
  record() {
    this.record2();
    /* this.file = this.media.create(this.path);
    this.file.startRecord();
    this.status = 'on'; */
  }

  stop() {
    /* if (Capacitor.isNativePlatform()) {
      this.file.stopRecord();
    } else {
      this.rec.stop();
    } */
    console.log('clicked');
    this.rec.stop();

    this.status = 'off';
  }

  sendAudioFileToback(data, name) {
    if (data != null) {
      let newMsg = new chatResponse(
        -1111,
        '00.00',
        name,
        false,
        this.generalService.getUser(),
        this.reciever
      );

      newMsg.data = data;
      newMsg.type = 'audio';
      this.generalService.sendMessage(newMsg);
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
