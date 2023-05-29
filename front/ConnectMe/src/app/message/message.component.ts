import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
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
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy, AfterViewInit {
  imageURI: any;
  imageFileName: any;
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
  dataProcess: boolean = false;
  @ViewChild('cnt', { read: ElementRef }) cnt: ElementRef;
  @ViewChild('inputFile', { read: ElementRef }) inputFile: ElementRef;
  inptmode: number = 1;
  imageFileNameFinal: any;
  imageData: string;

  constructor(
    private store: Store<State>,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private generalService: GeneralService,
    private http: HttpClient,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.msgs$ = this.store.select(selector.selectViewMessage);
    this.msgsSnglVw$ = this.store.select(selector.selectRecentSentText);
    this.reciever$ = this.store.select(selector.selectCurrentReciever);
    this.currrentUser$ = this.store.select(selector.selectCurrentUser);
  }
  ngAfterViewInit(): void {
    console.log('go to bottom page part');
    setTimeout(() => {
      this.scrollBottom(1000);
    }, 1000);
  }
  public scrollBottom(v): void {
    if (this.router.url.startsWith('/message')) {
      this.cnt.nativeElement.scrollToBottom(v);
    }
  }
  ngOnDestroy(): void {
    console.log('destroying message component');
    this.subscriptionList.forEach((s) => {
      s.unsubscribe();
    });
    //this.generalService.disConnect();

    this.reciever = '';
    this.store.dispatch(
      action.updateCurrentReciever({
        currentReciever: '',
      })
    );
    //this.router.navigate(['/chat', '']);
  }

  showFileInput(ele: HTMLInputElement) {
    ele.setAttribute('style', 'display:block');
  }

  ngOnInit() {
    console.log('ngOninit');

    this.subscriptionList.push(
      this.currrentUser$.subscribe((s) => {
        this.currentUser = s;
      })
    );

    this.subscriptionList.push(
      this.activatedroute.paramMap.subscribe((params) => {
        this.reciever = params.get('friend');
        this.store.dispatch(
          action.updateCurrentReciever({
            currentReciever: this.reciever,
          })
        );
      })
    );
    this.subscriptionList.push(
      this.msgsSnglVw$.subscribe((data) => {
        //here we can end the data process time, because new msg from backend was recieved.
        debugger;
        this.dataProcess = false;
        if (data != null) {
          console.log('data == ');
          console.log(data);
          console.log('this.currentUser == ');
          console.log(this.currentUser == '');
          // if (this.currentUser == '') {
          //   this.msgs.push(data);
          // }
          this.msgs.push(data);
          setTimeout(() => {
            console.log('go to bottom page part');
            this.scrollBottom(100);
          }, 1);
        }
      })
    );

    this.subscriptionList.push(
      this.msgs$.subscribe((m) => {
        console.log('in message component on reload');
        if (m != undefined && m != null && m.length > 0) {
          // this may never be true, but kept it incase i need it
          if (
            this.generalService.client == null ||
            this.generalService.client.connected == false
          ) {
            this.generalService.connect();
          }
          this.msgs = m;
        } else {
          //this.router.navigateByUrl('/chat');
          //this.router.navigate(['/chat', '']);
          //this is needed if reload for message component needs to work

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
            },
            (err) => {
              console.log(err);
              this.router.navigate(['chat']);
            }
          );
        }
      })
    );

    /* this.generalService
      .getMesssagesbyUser(this.reciever)
      .subscribe((aktualMsgs) => {
        console.log('got new msg');
        this.store.dispatch(
          action.updateViewdMessage({
            msgs: [],
          })
        );
        this.store.dispatch(
          action.updateViewdMessage({
            msgs: aktualMsgs,
          })
        ),
          (err) => {
            console.log(err);
          };
      }); */

    /* this.msgs.push(
      new chatResponse(
        '12.00',
        'Hi how are you?',
        false,
        this.generalService.getUser(),
        'shakil'
      )
    );
    this.msgs.push(
      new chatResponse(
        '12.00',
        'I am fine and you?',
        false,
        'shakil',
        this.generalService.getUser()
      )
    ); */
  }

  send(data) {
    let input: string = data.value;
    console.log(data.value);
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

  async getImage() {
    // const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.FILE_URI,
    //   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    // };

    // this.camera.getPicture(options).then(
    //   (imageData) => {
    //     this.imageURI = imageData;
    //     this.imageFileName = this.imageURI;
    //     console.log(imageData);
    //   },
    //   (err) => {
    //     console.log(err);
    //     this.presentToast(err);
    //   }
    // );
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      //resultType: CameraResultType..Base64,
    });

    console.log(image);
    const imageUrl = image.dataUrl;
    this.imageFileName = imageUrl;
    this.imageData = imageUrl;
    this.dataProcess = true;
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
    if (v == 2) {
      console.log(this.inputFile);
      this.inputFile.nativeElement.click();
    }
    if (v == 3) {
      this.getImage();
    }
    this.inptmode = v;
  }

  sendImage() {
    this.generalService.showBusy();
    this.imageFileNameFinal = this.imageFileName;
    this.imageFileName = null;
    this.inptmodeSet(1);
    this.sendFileToback(this.imageData);
  }

  sendFileToback(data) {
    this.inptmodeSet(1);
    if (data != null) {
      this.newMsg = new chatResponse(
        -1111,
        '00.00',
        '',
        false,
        this.generalService.getUser(),
        this.reciever
      );
      console.log(data);
      this.newMsg.data = data;
      this.generalService.sendMessage(this.newMsg);
    }
  }

  sendFile(data) {
    this.inptmodeSet(1);
    this.sendFileToback(
      //this.generalService.getFileAsBlob(this.imageFileNameFinal)
      this.imageData
    );
  }
}
