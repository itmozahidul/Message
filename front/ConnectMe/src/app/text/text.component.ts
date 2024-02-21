import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { GeneralService } from '../service/general.service';
import { Observable } from 'rxjs';
import * as selector from '../store/selector';
import * as action from '../store/action';
import { Store } from '@ngrx/store';
import { State } from '../store/reducer';
import { DisplayImageComponent } from '../display-image/display-image.component';
//import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  @Input() text: string = '';
  @Input() sender: string = '';
  @Input() reciever: string = '';
  @Input() time: string = '';
  @Input() seen: boolean = false;
  @Input() user: string = '';
  @Input() data: string = '';
  @Input() type: string = '';
  @ViewChild('cnt', { read: ElementRef }) cnt: ElementRef;
  isLeftSide: boolean = true;
  subscriptionList = [];
  image: string = 'http://localhost:8100/assets/avatar.png';
  image$: Observable<string>;
  rimage: string = 'http://localhost:8100/assets/avatar.png';
  rimage$: Observable<string>;
  zoom: boolean = false;
  dataUrl: URL;
  audio: HTMLAudioElement;
  aud_src;
  file_data_type = 'data';
  deleted: boolean = false;
  constructor(
    private generalService: GeneralService,
    private router: Router,
    public loadingCtrl: LoadingController,
    private store: Store<State>,
    public modalController: ModalController
  ) {
    this.image$ = this.store.select(selector.selectUserImage);
    this.rimage$ = this.store.select(selector.selectRecieverImage);
  }

  ngOnInit() {
    if (this.sender == '') {
      if (this.user != this.reciever) {
        this.deleted = true;
      }
    }

    if (this.type == 'audio') {
      this.aud_src = this.data;
    }

    if (this.type == 'file') {
      this.dataUrl = new URL(this.data);
      if (
        this.text.endsWith('.png') ||
        this.text.endsWith('.jpg') ||
        this.text.endsWith('.jpeg')
      ) {
        this.file_data_type = 'img';
      } else {
        this.file_data_type = 'data';
      }
    }

    this.isLeftSide = this.leftSide();

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
                  this.store.dispatch(
                    action.updateUserImage({ image: nimage })
                  ); //from backend image comes as an array
                } else {
                  nimage = 'assets/avatar.png';
                }
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
    this.subscriptionList.push(
      this.rimage$.subscribe((rcvimg) => {
        this.rimage = rcvimg;
      })
    );
  }

  loadingEnd() {
    console.log('loading ended');
    this.loadingCtrl.getTop().then(
      (succ) => {
        if (succ) {
          this.loadingCtrl.dismiss().then(
            (suc) => {
              if (suc) {
                console.log('loading ctrl end');
              } else {
                console.log('loading ctrl end Failed');
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      },
      (errr) => {
        console.log(errr);
      }
    );
  }

  leftSide() {
    return this.sender === this.user ? false : true;
  }
  displayPic(data) {
    //pictures will be shown after loading startet as it is async
    this.loadingStartShowPic('loading', data);
  }
  loadingStartShowPic(msg, data) {
    console.log('loading started');
    this.loadingCtrl
      .create({
        message: msg,
      })
      .then((toast) => {
        toast.present();
        this.store.dispatch(action.updateDisplayPic({ displayPic: data }));
        this.presentDisplayImageModal();
      });
  }
  async presentDisplayImageModal() {
    const modal = await this.modalController.create({
      component: DisplayImageComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }
  bypassUrlSecurity(data) {
    return data;
    //return this.generalService.bypassUrlSecurity(data);
  }
}
