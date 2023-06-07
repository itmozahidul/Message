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
      quality: 10,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      width: 10,
      height: 10,
      //resultType: CameraResultType..Base64,
    }).then(
      (image) => {
        const imageUrl = image.dataUrl;
        this.imageFileName = imageUrl;
        this.imageData = imageUrl;
      },
      (err) => {
        console.log('image is canceled');
        this.goToChat();
      }
    );
  }

  sendImage() {
    //this.generalService.showBusy();
    this.sendFileToback(this.imageData);
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
      newMsg.type = 'image';
      this.generalService.sendMessage(newMsg);
      this.goToChat();
    }
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
