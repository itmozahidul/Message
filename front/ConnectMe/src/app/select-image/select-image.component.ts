import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { chatResponse } from '../DTO/chatResponse';
import { Message } from '../model/message';
import { GeneralService } from '../service/general.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { State } from '../store/reducer';
import * as selector from '../store/selector';
import * as action from '../store/action';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-select-image',
  templateUrl: './select-image.component.html',
  styleUrls: ['./select-image.component.scss'],
})
export class SelectImageComponent implements OnInit {
  imageFileName: any;
  imageData: string;
  imageWebPath = '';
  imageBlob;
  imageBlobPromise;
  reciever: string = null;
  reciever$: Observable<string>;
  constructor(
    private store: Store<State>,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private generalService: GeneralService,
    private http: HttpClient,
    public modalController: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.reciever$ = this.store.select(selector.selectCurrentReciever);
  }

  ngOnInit() {
    this.reciever$.subscribe((r) => {
      this.reciever = r;
    });
    this.getImage();
  }

  getImage() {
    Camera.getPhoto({
      quality: 30,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      //width: 100,
      //height: 100,
      //resultType: CameraResultType..Base64,
    }).then(
      (image) => {
        this.imageWebPath = image.webPath;
        this.imageFileName = this.imageWebPath;
        console.log(image);
      },
      (err) => {
        console.log('image is canceled');
        this.goToChat();
      }
    );
  }

  async sendImage() {
    //this.generalService.showBusy();
    this.imageBlob = await this.http
      .get(this.imageWebPath, { responseType: 'blob' })
      .toPromise();
    const file = new File(
      [this.imageBlob],
      this.generalService.getUser() + '_' + this.reciever + 'image.png',
      { type: 'image/png' }
    );
    this.sendFile(file, file.name);
  }
  sendFileToback(data, name) {
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
      newMsg.type = 'image';
      this.generalService.sendMessage(newMsg);
      this.goToChat();
    }
  }
  sendFile(file, filename) {
    const bucket: FormData = new FormData();
    bucket.append('file', file);
    bucket.append('name', filename);
    this.generalService.sendFileWithoutWebSocket(bucket).subscribe(
      (suc) => {
        this.sendFileToback(suc.path, filename);
      },
      (err) => {
        this.generalService.loading_notification_short_hoover(
          'Failed to upload ' + filename
        );
      }
    );
  }

  async goToChat() {
    await this.modalController.dismiss({
      dismissed: true,
    });
    //await this.loadingStart('loading...');
  }

  async loadingStart(msg) {
    return await this.loadingCtrl
      .create({
        message: msg,
      })
      .then((toast) => {
        toast.present();
      });
  }
  async loadingEnd() {
    return await this.loadingCtrl.dismiss();
  }
}
