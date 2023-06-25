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
import { MaxLengthValidator } from '@angular/forms';
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
import { Capacitor } from '@capacitor/core';
import {
  IonContent,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { SelectImageComponent } from '../select-image/select-image.component';

import { RecordAudioComponent } from '../record-audio/record-audio.component';
import { NewFriendComponent } from '../new-friend/new-friend.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessageComponent implements OnInit, OnDestroy, AfterViewInit {
  isNativePlatform: boolean = false;
  imageURI: any;
  msgs: chatResponse[] = [];
  msgs$: Observable<chatResponse[]>;
  msgsSnglVw: chatResponse = null;
  msgsSnglVw$: Observable<chatResponse>;
  newMsg: Message = null;
  reciever: string = null;
  reciever$: Observable<string>;
  currentUser: string = '';
  currrentUser$: Observable<string>;
  subscriptionList = [];
  image: string = 'assets/avatar.png';
  image$: Observable<string>;
  rimage: string = 'assets/avatar.png';
  rimage$: Observable<string>;
  file: File = null;
  // @ViewChild('cnt', { read: ElementRef }) cnt: IonContent;
  @ViewChild(IonContent) cnt: IonContent;
  @ViewChild('inputFile', { read: ElementRef }) inputFile: ElementRef;
  inptmode: number = 1;

  constructor(
    private store: Store<State>,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private generalService: GeneralService,
    private http: HttpClient,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalController: ModalController
  ) {
    this.msgs$ = this.store.select(selector.selectViewMessage);
    this.msgsSnglVw$ = this.store.select(selector.selectRecentSentText);
    this.reciever$ = this.store.select(selector.selectCurrentReciever);
    this.currrentUser$ = this.store.select(selector.selectCurrentUser);
    this.image$ = this.store.select(selector.selectUserImage);
    this.rimage$ = this.store.select(selector.selectRecieverImage);
  }
  ngAfterViewInit(): void {
    console.log('go to bottom page part');
    this.modalController.dismiss();
  }
  public scrollBottom(v): void {
    if (this.router.url.startsWith('/message')) {
      //this.cnt.scrollToBottom(v);
    }
  }
  ngOnDestroy(): void {
    /* console.log('destroying message component');
    this.subscriptionList.forEach((s) => {
      s.unsubscribe();
    }); */
    //this.generalService.disConnect();

    this.reciever = 'n';
    this.store.dispatch(
      action.updateCurrentReciever({
        currentReciever: 'n',
      })
    );
    //this.router.navigate(['/chat', '']);
  }

  showFileInput(ele: HTMLInputElement) {
    ele.setAttribute('style', 'display:block');
  }

  ngOnInit() {
    if (
      this.generalService.client == null ||
      this.generalService.client.connected == false
    ) {
      this.generalService.connect().then((suc) => {
        this.ngOnInit_call();
      });
    } else {
      // if websoket is already connected then no need to createand wait for a new connection
      this.ngOnInit_call();
    }
  }

  ngOnInit_call() {
    console.log('ngOninit');

    this.isNativePlatform = Capacitor.isNativePlatform();
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
    this.subscriptionList.push(
      this.reciever$.subscribe((reciever_name) => {
        this.reciever = reciever_name;
        this.load_reciever_image(this.reciever);
        this.prepare_data_after_reciever_is_there();
      })
    );
  }

  prepare_data_after_reciever_is_there() {
    this.subscriptionList.push(
      this.msgsSnglVw$.subscribe((data) => {
        //here we can end the data process time, because new msg from backend was recieved.
        console.log('####################');
        console.log(this.reciever);
        console.log(data);
        if (data != null) {
          if (
            (data.sender == this.currentUser &&
              data.reciever == this.reciever) ||
            (data.reciever == this.currentUser && data.sender == this.reciever)
          ) {
            this.msgs.unshift(data);
          }

          /* if (data.reciever == this.currentUser) {
            this.generalService.notify();
          } */
        }
      })
    );

    this.subscriptionList.push(
      this.msgs$.subscribe((m) => {
        console.log('in message component on reload');
        if (m != undefined && m != null && m.length > 0) {
          // this may never be true, but kept it incase i need it
          this.msgs = m.slice().reverse();
          this.loadingEnd();
        } else {
          this.generalService.getMesssagesbyUser(this.reciever).subscribe(
            (aktualMsgs) => {
              console.log('got new msg');

              if (aktualMsgs.length > 0) {
                this.store.dispatch(
                  action.updateViewdMessage({
                    msgs: aktualMsgs,
                  })
                );
              }
              {
                //its a new chat or the have eptied chat
                this.loadingEnd();
              }
            },
            (err) => {
              console.log(err);
              this.loadingEnd();
              this.generalService.loading_notification_short_hoover(
                'Messages Loading failed!'
              );
              this.modalController.dismiss();
            }
          );
        }
      })
    );

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

  load_reciever_image(rsvr) {
    this.subscriptionList.push(
      this.rimage$.subscribe((s) => {
        if (s == '') {
          let nimage: string = '';
          this.generalService.getUserPhoto(rsvr).subscribe(
            (suc) => {
              if (suc[0].length > 0) {
                nimage = suc[0];
              } else {
                nimage = 'assets/avatar.png';
              }
              this.store.dispatch(
                action.updateRecieverImage({ rimage: nimage })
              ); //from backend image comes as an array
            },
            (err) => {
              console.log(err);
              this.rimage = 'assets/avatar.png';
            }
          );
        } else {
          this.rimage = s;
        }
      })
    );
  }

  send(data) {
    let input: string = data.value;
    if (
      input != null &&
      input.length > 0 &&
      input.trim() != '' &&
      input.trim() != ' '
    ) {
      this.newMsg = new chatResponse(
        -1111,
        '00.00',
        data.value,
        false,
        this.generalService.getUser(),
        this.reciever
      );
      this.generalService.sendMessage(this.newMsg);
    }
    data.value = '';
  }

  loadingStart(msg) {
    console.log('loading started');
    this.loadingCtrl
      .create({
        message: msg,
      })
      .then((toast) => {
        toast.present();
      });
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

  uploadFile() {
    let loader = this.loadingCtrl
      .create({
        message: 'Uploading...',
      })
      .then((toast) => {
        toast.present();
      });

    /*const fileTransfer: FileTransferObject = this.transfer.create();

     fileTransfer.upload(this.imageURI, 'http://192.168.0.7:8080/api/uploadImage', options)
      .then((data) => {
      console.log(data+" Uploaded Successfully");
      this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
      loader.dismiss();
      this.presentToast("Image uploaded successfully");
    }, (err) => {
      console.log(err);
      loader.dismiss();
      this.presentToast(err);
    }); */
  }

  presentToast(msg) {
    this.toastCtrl
      .create({
        message: msg,
        duration: 3000,
        position: 'bottom',
      })
      .then((toast) => {
        toast.present();
      });
  }
  displayToast() {
    this.toastCtrl
      .create({
        header: 'Welcome!',
        message: 'John!',
        position: 'top',
        cssClass: 'toast-custom-class',
        buttons: [
          {
            side: 'end',
            icon: 'person',
            handler: () => {
              console.log('');
            },
          },
          {
            side: 'end',
            text: 'Close',
            role: 'cancel',
            handler: () => {
              console.log('');
            },
          },
        ],
      })
      .then((toast) => {
        toast.present();
      });
  }

  inptmodeSet(v: number) {
    this.inptmode = v;
    if (v == 2) {
      //this.handelfile();
    }
    if (v == 4) {
      this.presentRecordAudioModal();
      //this.router.navigateByUrl('selectImage');
      this.inptmode = 1;
    }
    if (v == 3) {
      this.presentSelectImageModal();
      //this.router.navigateByUrl('selectImage');
      this.inptmode = 1;
    }
  }
  handelfile(event) {
    this.file = event.target.files[0];
    let limit = 50 * 1024 * 1024; // 50 MB
    if (this.file.size > limit) {
      this.generalService.loading_notification_short_hoover('File is too big.');
    }

    /* if(this.file.type=="image/png"){

    }else{
      
    } */
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
      newMsg.type = 'file';
      this.generalService.sendMessage(newMsg);
    }
  }

  sendFile() {
    const bucket: FormData = new FormData();
    bucket.append('file', this.file);
    bucket.append('name', this.file.name);
    this.generalService.sendFileWithoutWebSocket(bucket).subscribe(
      (suc) => {
        this.sendFileToback(suc.path, this.file.name);
      },
      (err) => {
        this.generalService.loading_notification_short_hoover(
          'Failed to upload ' + this.file.name
        );
      }
    );
  }
  async presentSelectImageModal() {
    const modal = await this.modalController.create({
      component: SelectImageComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }

  async presentRecordAudioModal() {
    const modal = await this.modalController.create({
      component: RecordAudioComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }
  endModal() {
    this.modalController.dismiss();
    this.store.dispatch(action.updateCurrentReciever({ currentReciever: '' }));
  }
}
