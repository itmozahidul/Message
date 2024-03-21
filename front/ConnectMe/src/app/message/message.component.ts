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
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessageComponent implements OnInit, OnDestroy, AfterViewInit {
  toggledemo: boolean = false;
  isNativePlatform: boolean = false;
  imageURI: any;
  msgs: chatResponse[] = [];
  msgs$: Observable<chatResponse[]>;
  msgsSnglVw: chatResponse = null;
  msgsSnglVw$: Observable<chatResponse>;
  msgidupdate$: Observable<string>;
  msgidupdate: string = '';
  newMsg: Message = null;
  reciever: string = null;
  reciever$: Observable<string>;
  currentUser: string = '';
  currrentUser$: Observable<string>;
  subscriptionList: Subscription[] = [];
  image: string = 'assets/avatar.png';
  image$: Observable<string>;
  rimage: string = 'assets/avatar.png';
  rimage$: Observable<string>;
  chatid: string;
  deletedmsgidid$: Observable<string>;

  deletedmsgidid: string;
  deletedmsgidse$: Observable<string>;
  deletedmsgidse: string;
  chatid$: Observable<string>;
  firstload: number = 10;
  offsetload: number = 5;
  file: File = null;

  // @ViewChild('cnt', { read: ElementRef }) cnt: IonContent;
  @ViewChild(IonContent) cnt: IonContent;
  @ViewChild('inputFile', { read: ElementRef }) inputFile: ElementRef;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  inptmode: number = 1;
  activetext: string = '';
  emojimode: number = 0;
  configuration: null;
  dataChannel: RTCDataChannel;
  peerConnection: RTCPeerConnection;

  constructor(
    private store: Store<State>,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private generalService: GeneralService,
    private http: HttpClient,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController
  ) {
    this.msgs$ = this.store.select(selector.selectViewMessage);
    this.msgsSnglVw$ = this.store.select(selector.selectRecentSentText);
    this.reciever$ = this.store.select(selector.selectCurrentReciever);
    this.currrentUser$ = this.store.select(selector.selectCurrentUser);
    this.image$ = this.store.select(selector.selectUserImage);
    this.rimage$ = this.store.select(selector.selectRecieverImage);
    this.msgidupdate$ = this.store.select(selector.selectMsgidupdate);
    this.chatid$ = this.store.select(selector.selectCurrentchatid);
    this.deletedmsgidid$ = this.store.select(selector.selectDeletedmessageidid);
    this.deletedmsgidse$ = this.store.select(selector.selectDeletedmessageidse);
  }
  ngAfterViewInit(): void {
    console.log('this.inputFile');
    console.log(this.inputFile);
  }
  loadData(event) {
    setTimeout(() => {
      console.log('D-----2------one');
      event.target.complete();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.msgs.length > 0) {
        this.getMsgsDatafromBackend(
          this.msgs[0].chatid,
          this.offsetload,
          this.msgs.length
        ).then(
          (resolve: Chathead) => {
            console.log(this.msgs);
            console.log(resolve);

            if (resolve.rsp.length > 0) {
              // this.msgs = resolve.rsp.slice().reverse().concat(this.msgs);
              let temp: any[] = resolve.rsp.slice().reverse();
              this.msgs = [...temp, ...this.msgs];
              console.log(this.msgs);
            }
          },
          (reject: string) => {
            console.log(reject);
          }
        );
      }
    }, 500);
    if (this.msgs.length == 1000) {
      event.target.disabled = true;
    }
  }

  handleSelection(event) {
    this.activetext = this.activetext + ' ' + event.char;
    this.toggledemo = false;
  }
  public scrollBottom(v): void {
    setTimeout(() => {
      console.log(
        '######################### scroll to the bottom #######################'
      );
      this.cnt.scrollToBottom(v);
      this.loadingEnd();
    }, 700);
  }
  ngOnDestroy(): void {
    console.log('destroying message component');
    this.subscriptionList.forEach((s) => {
      s.unsubscribe();
    });
    //this.generalService.disConnect();
    //this.router.navigate(['/chat', '']);
  }

  showFileInput(ele: HTMLInputElement) {
    ele.setAttribute('style', 'display:block');
  }

  ngOnInit() {
    console.log('in message ngoninit');
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
    this.isNativePlatform = Capacitor.isNativePlatform();
    /* this.subscriptionList.push(
      this.activatedroute.paramMap.subscribe((params) => {
        console.log('in chat and param url is');
        let name = params.get('name');
        let chatidt = params.get('chatid');
        console.log(name);
        if (
          name != undefined &&
          name != null &&
          name.length > 0 &&
          name.trim() != '' &&
          chatidt != undefined &&
          chatidt != null &&
          chatidt.length > 0 &&
          chatidt.trim() != ''
        ) {
          this.chatid = chatidt;
          this.getMsgsDatafromBackend(chatidt);
          this.store.dispatch(
            action.updateCurrentReciever({
              currentReciever: name,
            })
          );
        } else {
          console.log('invalid chat id or empty user');
        }
      })
    ); */
    this.subscreibcurrentuser();
    this.subscreibtoreciever();
    this.subscreib_currentchatid();
    this.subscreibtosingelmessage();
    this.subscreib_current_user_image();
    this.subscreib_reciever_image();
    this.subscreibviewedmsgs();
    this.subscreib_deletemsgidid();
    this.subscreib_deletemsgidse();
    /* this.subscreib_offer();
    this.subscreib_ans();
    this.subscreib_cand(); */
  }

  /*  subscreib_offer() {
    this.subscriptionList.push(
      this.offer$.subscribe((strobj) => {
        this.offer = strobj;
        let t = JSON.parse(strobj);
        this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(t.data)
        );
        this.peerConnection.createAnswer(
          (answer) => {
            this.sendWebrtcrequest('answer', answer);
          },
          (error) => {
            console.log('couldnt subscreib answer to offer of remote client');
          }
        );
      })
    );
  }

  subscreib_ans() {
    this.subscriptionList.push(
      this.answer$.subscribe((strobj) => {
        this.answer = strobj;
        let t = JSON.parse(strobj);
        this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(t.data)
        );
      })
    );
  }

  subscreib_cand() {
    this.subscriptionList.push(
      this.candidate$.subscribe((strobj) => {
        this.candidate = strobj;
        let t = JSON.parse(strobj);
        this.peerConnection.addIceCandidate(new RTCIceCandidate(t.data));
      })
    );
  } */

  subscreib_deletemsgidid() {
    this.subscriptionList.push(
      this.deletedmsgidid$.subscribe((id) => {
        this.deletedmsgidid = id;
        this.msgs.forEach((m) => {
          if (m.id.toString() == id) {
            m.type = '';
          }
        });
      })
    );
  }

  subscreib_deletemsgidse() {
    this.subscriptionList.push(
      this.deletedmsgidse$.subscribe((id) => {
        this.deletedmsgidse = id;
        for (let i = 0; i < this.msgs.length; i++) {
          if (this.msgs[i].id.toString() == id) {
            this.msgs[i].text = 'deleted';
            this.msgs[i].type = 'deleted';
          }
        }
      })
    );
  }

  subscreibcurrentuser() {
    this.subscriptionList.push(
      this.currrentUser$.subscribe((s) => {
        // this needs to be checked for a infinit loop situation
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
  }

  subscreibtoreciever() {
    this.subscriptionList.push(
      this.reciever$.subscribe((reciever_name) => {
        console.log('reciever subscription ' + reciever_name);
        this.reciever = reciever_name;
        if (
          reciever_name != '' &&
          reciever_name != null &&
          reciever_name != undefined
        ) {
          this.reciever = reciever_name;
          this.load_reciever_image(this.reciever);
          //rest of the subscription is happening inside this function
          //easy to read
        } else {
          console.log('current reciever is now empty ' + this.reciever);
          this.gotoChatPage();
        }
        console.log(this.reciever);
      })
    );
  }
  gotoChatPage() {
    /*this.subscriptionList.forEach((s) => {
      s.unsubscribe();
    });*/
    this.router.navigate(['/chat']);
  }

  subscreibviewedmsgs() {
    this.subscriptionList.push(
      this.msgs$.subscribe((m) => {
        console.log('in message component on reload');

        // this may never be true, but kept it incase i need it
        if (
          this.reciever != null &&
          this.reciever != undefined &&
          this.reciever != ''
        ) {
          if (m != undefined && m != null && m.length > 0) {
            this.msgs = m.slice().reverse();
          } else {
            this.msgs = m;
          }

          //this.msgs = m;
          this.scrollBottom(0);
        } else {
          console.log('reciever is empty ' + this.reciever);
          this.msgs = m;
        }
      })
    );

    this.subscriptionList.push(
      this.msgidupdate$.subscribe((n) => {
        console.log('trying to update messages as seen chat id ' + n);
        if (n != '' && n != this.msgidupdate) {
          this.msgidupdate = n;
          console.log('updating seen message ' + n);
          this.msgs.forEach((m) => {
            if (m.seen == false) {
              m.seen = true;
              console.log(m.chatid);
            }
          });
        }
      })
    );
  }

  subscreibtosingelmessage() {
    this.subscriptionList.push(
      this.msgsSnglVw$.subscribe((data) => {
        //here we can end the data process time, because new msg from backend was recieved.
        console.log('######### update single message ###########');
        console.log(this.reciever);
        console.log(data);
        if (
          this.reciever != '' &&
          this.reciever != null &&
          this.reciever != undefined
        ) {
          if (data != null) {
            if (data.reciever != '' && data.sender != '') {
              if (
                this.reciever == data.sender ||
                this.generalService.getUser() == data.sender
              ) {
                //this.msgs.unshift(data);
                this.msgs.push(data);
                this.scrollBottom(1000);
                if (data.sender != this.generalService.getUser()) {
                  data.seen = true;
                  this.generalService.sendMessage2(data, 'msgseennotify');
                } else {
                  console.log(
                    'msg is not updated as seen cause you are the sender not the reciever of this message reciever is ' +
                      data.reciever
                  );
                }

                /* if (data.reciever == this.currentUser) {
                  this.generalService.notify();
                } */
              } else {
                console.log('wrong chat head was attempted to update new msg ');
              }
            } else {
              console.log('msg is without reciever and sender info');
            }
          } else {
            console.log('msg is corrupted ');
            console.log(data);
          }
        } else {
          console.log('reciever is empty ' + this.reciever);
        }
      })
    );
  }

  subscreib_current_user_image() {
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

  subscreib_reciever_image() {
    this.rimage$.subscribe((m) => {
      this.rimage = m;
    });
  }

  subscreib_currentchatid() {
    this.chatid$.subscribe(
      (m) => {
        if (m != this.chatid) {
          console.log('current chatid subscription ' + m);
          this.chatid = m;
          // chat id needs not to be checked here , it will be checked in following function
          this.getMsgsDatafromBackend(m, this.firstload, 0).then(
            (resolve: Chathead) => {
              console.log(resolve);
              this.store.dispatch(
                action.updateViewdMessage({
                  msgs: resolve.rsp,
                })
              );
              if (resolve.unreadMessageNo > 0) {
                this.sendrequesttobacktosetmsgasseen(
                  resolve.id,
                  resolve.rsp[resolve.rsp.length - 1].id
                );
              }
            },
            (reject: string) => {
              console.log(reject);
            }
          );
        }
        if (m == '') {
          this.store.dispatch(action.updateViewdMessage({ msgs: [] }));
          this.store.dispatch(
            action.updateCurrentReciever({ currentReciever: '' })
          );
        } else {
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  sendrequesttobacktosetmsgasseen(chatid, lastmsgid) {
    let cr: chatResponse = new chatResponse(
      lastmsgid,
      '',
      1,
      0,
      '',
      true,
      this.generalService.getUser(),
      this.reciever == ''
        ? this.generalService.getFromLocal(
            this.generalService.currentrecieverlocal
          )
        : this.reciever
    );
    cr.chatid = chatid;
    this.generalService.sendMessage2(cr, 'msgseennotifyall');
  }

  load_reciever_image(rsvr) {
    let nimage: string = '';
    this.generalService.getUserPhoto(rsvr).subscribe(
      (suc) => {
        if (suc[0].length > 0) {
          nimage = suc[0];
        } else {
          nimage = 'assets/avatar.png';
        }
        this.store.dispatch(action.updateRecieverImage({ rimage: nimage })); //from backend image comes as an array
      },
      (err) => {
        console.log(err);
        this.rimage = 'assets/avatar.png';
      }
    );
  }

  getMsgsDatafromBackend(chatid, limit, offset) {
    return new Promise((resolve: any, reject: any) => {
      if (chatid != '' && chatid != null && chatid != undefined) {
        this.generalService
          .getChatHeadinfobychatid(chatid, limit, 0, offset)
          .subscribe(
            (data) => {
              this.loadingEnd();
              if (data.rsp.length > 0) {
                resolve(data);
              } else {
                console.log(
                  'no msgs are dispatch cause it is empty ' + this.reciever
                );
                reject(
                  'no msgs are dispatch cause it is empty ' + this.reciever
                );
              }
            },
            (err) => {
              this.handelErrorwithLoadingMessage(err);
              reject(err);
            }
          );
      } else {
        reject('chat id wrong, may be empty');
        console.log(chatid);
      }
    });
  }

  handelErrorwithLoadingMessage(err) {
    console.log('###################################################' + err);
    this.loadingEnd();
    this.generalService.loading_notification_short_hoover(
      'Messages Loadingnnnnn failed!'
    );
  }

  send(data) {
    let input: string = data;
    try {
      if (
        input != null &&
        input.length > 0 &&
        input.trim() != '' &&
        input.trim() != ' ' &&
        this.reciever != '' &&
        this.generalService.getUser() != ''
      ) {
        let newMsge = new chatResponse(
          -1111,
          '00.00',
          1,
          0,
          input,
          false,
          this.generalService.getUser(),
          this.reciever
        );
        newMsge.chatid = this.generalService.getFromLocal(
          this.generalService.currentchatid
        );

        this.generalService.sendMessage(newMsge);
      } else {
        throw new Error('text or reciever or sender might be empty');
      }
    } catch (error) {
      console.log(error);
    }
    this.activetext = '';
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
    try {
      this.loadingCtrl.getTop().then((succ) => {
        if (succ) {
          this.loadingCtrl.dismiss().then(
            (suc) => {
              if (suc) {
                console.log('loading ctrl end');
                this.loadingEnd();
              } else {
                console.log('loading ctrl end Failed');
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
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

  recordStopped(e) {
    this.inptmodeSet(1);
  }

  setemojimode(k: number) {
    this.emojimode = k;
  }

  inptmodeSet(v: number) {
    this.emojimode = 0;
    this.inptmode = v;
    if (v == 2) {
      //this.handelfile();
      console.log(this.inputFile);
      // this.inputFile.nativeElement.click();
    }
    if (v == 4) {
      //this.presentRecordAudioModal();
      //this.router.navigateByUrl('selectImage');
    }
    if (v == 3) {
      this.presentSelectImageModal();
      //this.router.navigateByUrl('selectImage');
      this.inptmode = 1;
    }
    if (v == 5) {
      //this.presentSelectImageModal();
      //this.router.navigateByUrl('selectImage');
      this.inptmode = 1;
    }
    if (v == 6) {
      //this.presentSelectImageModal();
      //this.router.navigateByUrl('selectImage');
      this.toggledemo = true;
      this.inptmode = 1;
    }
  }
  handelfile(event) {
    this.file = event.target.files[0];
    let limit = 50 * 1024 * 1024; // 50 MB
    if (this.file.size > limit) {
      this.inptmodeSet(1);
      this.generalService.loading_notification_short_hoover('File is too big.');
    }

    /* if(this.file.type=="image/png"){

    }else{
      
    } */
  }

  sendFileToback(data, name) {
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

      newMsg.data = data;
      newMsg.type = 'file';
      newMsg.chatid = this.generalService.getFromLocal(
        this.generalService.currentchatid
      );
      console.log('#############################');
      console.log(newMsg);
      this.generalService.sendMessage(newMsg);
    } else {
      throw new Error('data or sender or reciever might be empty');
    }
  }

  sendFile(f: HTMLInputElement) {
    console.log(f.files);
    f.files[0] = null;
    const bucket: FormData = new FormData();
    bucket.append('file', this.file);
    bucket.append(
      'name',
      this.generalService.getUser() + '_' + this.reciever + this.file.name
    );
    this.generalService.sendFileWithoutWebSocket(bucket).subscribe(
      (suc) => {
        this.sendFileToback(suc.path, this.file.name);
        this.inptmodeSet(1);
      },
      (err) => {
        this.inptmodeSet(1);
        this.generalService.loading_notification_short_hoover(
          'Failed to upload ' + this.file.name
        );
      }
    );
  }
  async presentSelectImageModal() {
    const modal = await this.modalController.create({
      component: SelectImageComponent,
      cssClass: 'my-custom-class-img',
    });
    return await modal.present();
  }

  async presentRecordAudioModal() {
    const modal = await this.modalController.create({
      component: RecordAudioComponent,
      cssClass: 'my-custom-class-record',
    });
    return await modal.present();
  }

  gotoProfile(name) {
    this.router.navigate(['/dprofile', name]);
  }

  back() {
    console.log('######### leaving message window ###############');

    this.store.dispatch(
      action.updateRecentSentText({
        sentText: null,
      })
    );

    this.generalService.saveInlocal(this.generalService.currentchatid, '');
    this.generalService.saveInlocal(
      this.generalService.currentrecieverlocal,
      ''
    );
    //this has to be at the end to enable the other subscribstion to finish their cleaning job
    //before we end the subscription later in reciever;
    //current chat id empty triggers setting current reciever empty, this triggers to go to chat page back
    console.log(
      '######################################################current chat is dispatched ' +
        ''
    );

    this.store.dispatch(action.updateCurrrentchatid({ currentchatid: '' }));

    // we dont need to go directly to chat, if the reciever is empty it will take us to chat
    // this.router.navigate(['/chat']);
  }

  async presentActionSheet(msgid: number, sender: string, reciever, ele: any) {
    console.log(ele);
    if (sender == this.generalService.getUser()) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Message',
        buttons: [
          {
            text: 'Delete for you?',
            role: 'destructive',
            icon: 'trash',
            handler: () => {
              this.removeyouassender(msgid, sender, reciever);
              ele.text = 'deleted';
              ele.type = 'deleted';
            },
          },
          {
            text: 'Delete for everyone?',
            role: 'destructive',
            icon: 'trash',
            handler: () => {
              this.deleteMsgbykey(msgid, sender, reciever);
            },
          },
          /*,  {
          text: 'Share',
          icon: 'share',
          handler: () => {
            console.log('Share clicked');
          }
        }, {
          text: 'Play (open modal)',
          icon: 'arrow-dropright-circle',
          handler: () => {
            console.log('Play clicked');
          }
        }, {
          text: 'Favorite',
          icon: 'heart',
          handler: () => {
            console.log('Favorite clicked');
          }
        } */ {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
        ],
      });
      await actionSheet.present();
    }
  }
  deleteMsgbykey(key: number, sender: string, reciever: string) {
    let cr: chatResponse = new chatResponse(
      key,
      '',
      1,
      0,
      '',
      true,
      sender,
      reciever
    );
    this.generalService.sendMessage2(cr, 'messagedelete');
  }
  removeyouassender(key: number, sender: string, reciever: string) {
    let cr: chatResponse = new chatResponse(
      key,
      '',
      1,
      0,
      '',
      true,
      sender,
      reciever
    );
    this.generalService.sendMessage2(cr, 'removesender');
  }
  addemoticintext(emo) {
    console.log(emo);
    this.activetext = this.activetext + ' ' + emo + ' ';
  }

  sendImgFileToback(data, name) {
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
      newMsg.type = 'image';
      this.generalService.sendMessage(newMsg);
    } else {
      throw new Error('Image or reciever or sender might be empty');
    }
  }

  addGifintext(data) {
    this.sendImgFileToback(data, '');
    this.inptmodeSet(1);
  }

  makecall() {
    this.store.dispatch(
      action.updateCall({
        call:
          this.generalService.call_started_me +
          this.generalService.separator +
          this.reciever,
      })
    );
    //this.router.navigate(['/calldisp', this.reciever]);
  }

  /* sendWebrtcrequest(type, obj) {
    let text = JSON.stringify({
      event: type,
      data: obj,
    });

    let newMsge = new chatResponse(
      -1111,
      '00.00',
      1,
      0,
      text,
      false,
      this.generalService.getUser(),
      this.reciever
    );
    newMsge.chatid = this.generalService.getFromLocal(
      this.generalService.currentchatid
    );

    this.generalService.sendMessage2(newMsge, type);
  }

  createsignalcon() {
    this.configuration = null;
    this.peerConnection = new RTCPeerConnection(this.configuration);
    this.dataChannel = this.peerConnection.createDataChannel('dataChannel');
    this.dataChannel.onerror = (error) => {
      console.log('Error:', error);
    };
    this.dataChannel.onclose = () => {
      console.log('Data channel is closed');
    };
    this.peerConnection.createOffer(
      (offer) => {
        this.sendWebrtcrequest('offer', offer);
        this.peerConnection.setLocalDescription(offer);
      },
      (error) => {
        //habdel
        console.log('offer from client has failed');
      }
    );

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendWebrtcrequest('candidate', event.candidate);
      }
    };
  } */
}
