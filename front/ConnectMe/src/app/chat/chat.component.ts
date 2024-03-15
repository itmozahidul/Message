import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, IonList } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { chatResponse } from '../DTO/chatResponse';
import { GeneralService } from '../service/general.service';
import { State } from '../store/reducer';
import * as selector from '../store/selector';
import * as action from '../store/action';
import { KeyValue } from '@angular/common';
import {
  IonContent,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { LocationComponent } from '../location/location.component';
import { NewFriendComponent } from '../new-friend/new-friend.component';
import { MessageComponent } from '../message/message.component';
import { Friend } from '../model/Friend';
import { Chathead } from '../DTO/chatHead';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  disable = false; //upon going to message it is true, leaving the message is set to false. in reciever update with empty string defines it.
  hasError: boolean = false;
  errommsg = '';
  currentUser: string = '';
  subscriptionList: any[] = [];
  currrentUser$: Observable<string>;
  image: string = 'assets/avatar.png';
  items: any[] = [];
  //friends: Map<string, chatResponse[]> = new Map();
  chatHeadsname: Map<string, Chathead> = new Map();
  friendsPic: Map<string, string> = new Map();
  currentChatHeads: chatResponse[] = [];
  currentChatHeads$: Observable<chatResponse[]>;
  msgsSnglVw: chatResponse = null;
  msgsSnglVw$: Observable<chatResponse>;
  friendsnames: string[] = [];
  friendsnames$: Observable<string[]>;
  //@ViewChild('cilist') cilist:IonList;
  pic: string = '';
  latests: Map<string, chatResponse[]> = new Map();
  originalOrder2() {
    return 0;
  }
  originalOrder = (a: Chathead, b: Chathead) => {
    return a.rsp[a.rsp.length - 1].timemili > b.rsp[b.rsp.length - 1].timemili;
  };
  unreadMessagesNo: Map<string, number> = new Map();
  reciever: string = null;
  reciever$: Observable<string>;
  chatid: string = '';
  chatid$: Observable<string>;
  deletedchatid: string = '';
  deletedchatid$: Observable<string>;
  @ViewChild(IonContent) cntc: IonContent;
  constructor(
    private store: Store<State>,
    private router: Router,
    private generalService: GeneralService,
    private activatedroute: ActivatedRoute,
    public toastCtrl: ToastController,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController
  ) {
    this.currrentUser$ = this.store.select(selector.selectCurrentUser);
    this.currentChatHeads$ = this.store.select(selector.selectCurrentChatHeads);
    this.msgsSnglVw$ = this.store.select(selector.selectRecentSentTextChat);
    this.reciever$ = this.store.select(selector.selectCurrentReciever);
    this.friendsnames$ = this.store.select(selector.selectFriendsNames);
    this.chatid$ = this.store.select(selector.selectCurrentchatid);
    this.deletedchatid$ = this.store.select(selector.selectDeletedchatid);
  }

  ngOnInit() {
    this.disable = false;
    console.log('in chat ngoninit');
    this.sub_rcver();
    this.sub_currrentuser();
    this.sub_delete_chatid();
    this.sub_chatid();
    this.sub_msgsSnglVw();
  }

  loadingStart(msg) {
    this.generalService.loadingCtrl
      .create({
        message: msg,
        duration: this.generalService.notificationDuration,
      })
      .then((toast) => {
        toast.present();
      });
  }

  loadingStartGoingToMessageComponent(msg) {
    this.loadingEnd('105');
    this.generalService.loadingCtrl
      .create({
        message: msg,
      })
      .then((toast) => {
        console.log('loading started');
        toast.present();
      });
  }
  sub_rcver() {
    this.subscriptionList.push(
      this.reciever$.subscribe((data) => {
        console.log(
          'old value ' +
            this.reciever +
            ' , new subscription reciever is ' +
            data
        );
        this.disable = false;
        if (data == '') {
          this.get_Data_From_the_backend();
        } else {
          console.log(
            'the subscribtion of reciever got empty value while it was already empty no need to load data from the back.because it meant chat component is reloaded'
          );
        }
        this.reciever = data;
      })
    );
  }
  sub_routermap() {
    this.subscriptionList.push(
      this.activatedroute.paramMap.subscribe((params) => {
        console.log('in chat and param url is');
        let name = params.get('friend');
        console.log(name);
        if (
          name != undefined &&
          name != null &&
          name.length > 0 &&
          name.trim() != ''
        ) {
          this.prepareChatHead(name, 1);
        } else {
          this.get_Data_From_the_backend();
        }
      })
    );
  }
  sub_currrentuser() {
    this.subscriptionList.push(
      this.currrentUser$.subscribe((s) => {
        console.log('current user in chat ');
      })
    );
  }

  sub_delete_chatid() {
    this.subscriptionList.push(
      this.deletedchatid$.subscribe((m) => {
        this.deletedchatid = m;
        if (m != '') {
          this.chatHeadsname.delete(m);
          this.unreadMessagesNo.delete(m);
          this.loadingEnd('157');
          this.store.dispatch(
            action.updateDeletedchatid({ deletedchatid: '' })
          );
        }
      })
    );
  }
  sub_chatid() {
    this.subscriptionList.push(
      this.chatid$.subscribe((m) => {
        this.chatid = m;
        if (m != null && m != undefined && m != '') {
          if (this.chatHeadsname.has(m)) {
            this.chatHeadsname.get(m).unreadMessageNo = 0;
          }
        }
      })
    );
  }
  sub_msgsSnglVw() {
    this.subscriptionList.push(
      this.msgsSnglVw$.subscribe((recentText) => {
        //

        if (recentText != null) {
          console.log('in chat component updating recent text');
          if (
            this.chatHeadsname.size > 0 &&
            this.chatHeadsname.has(recentText.chatid)
          ) {
            console.log('chat id already exist in chathead list');
            if (recentText.sender != this.generalService.getUser()) {
              console.log('you have recieved  a message from the backend');
              if (this.reciever != recentText.sender) {
                console.log(
                  'you are not currently in chat with sender of this message, thats why'
                );
                console.log('unread message no got increased by 1');
                this.chatHeadsname.get(recentText.chatid).unreadMessageNo++;
              }
            } else {
              console.log('ur own sent message has come from back end');
            }

            this.chatHeadsname.get(recentText.chatid).rsp.unshift(recentText);
          } else {
            console.log('new chat id , adding it to chathead list');
            this.generalService
              .getChatHeadinfobychatid(
                recentText.chatid,
                1,
                recentText.timemili,
                0
              )
              .subscribe(
                (suc) => {
                  /* if (this.reciever != recentText.sender) {
                    console.log('unread message no got increased by 1');
                    suc.unreadMessageNo++;
                  } */
                  this.chatHeadsname.set(recentText.chatid, suc);
                  let dynamicUser = suc.name.split('_');
                  if (dynamicUser.length > 1) {
                    suc.dynamicReciever =
                      dynamicUser[0] == this.generalService.getUser()
                        ? dynamicUser[1]
                        : dynamicUser[0];
                    this.chatHeadsname.set(recentText.chatid, suc);
                  } else {
                    console.log(
                      'this chat has no valid name, it contains no users name, chat can not be added'
                    );
                  }
                },
                (err) => {
                  console.log(err);
                }
              );
          }
        }
      })
    );
  }
  loadingEnd(l) {
    console.log('loadingend is called from line ' + l);

    /* setTimeout(() => {
      
    }, 3000); */
    try {
      this.generalService.loadingCtrl.dismiss().then(
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

  get_Data_From_the_backend() {
    console.log('getting data from backend');
    let s = this.generalService.getUser();

    if (s != '') {
      // if websoket got disconnected the renew it
      if (
        this.generalService.client == null ||
        this.generalService.client.connected == false
      ) {
        this.generalService.loadingCtrl
          .create({
            message: 'Connecting...',
            duration: this.generalService.notificationDuration,
          })
          .then((toast) => {
            toast.present();
            this.generalService.connect().then(
              (suc) => {
                this.loadingEnd('275');
                this.prepareChatHead(s, 0);
              },
              (err) => {
                this.hasError = true;
                console.log(err);
                this.errommsg = 'connection failed!';
                this.loadingEnd('282');
              }
            );
          });
      } else {
        // if websoket connection is there then as usual prosess
        this.prepareChatHead(s, 0);
      }
    } else {
      //TODO when no user is in local storage?
      this.loadingEnd(292);
      this.generalService.loading_notification_short_hoover(
        'Session is expeired. Trying to reconnect.'
      );

      this.router.navigate(['/login']);
    }
  }

  prepareChatHead(name, opt) {
    this.generalService.loadingCtrl
      .create({
        message: 'loading...',
        duration: this.generalService.notificationDuration,
      })
      .then((toast) => {
        toast.present();
        this.generalService.getChatHeadinfo(name).subscribe(
          (suc) => {
            console.log(suc);
            console.log('in prepared chat ###################');
            this.chatHeadsname = new Map(
              suc.map((obj) => {
                let dynamicUser: string = (obj.dynamicReciever =
                  obj.name.split('_'));
                if (dynamicUser.length > 1) {
                  obj.dynamicReciever =
                    dynamicUser[0] == this.generalService.getUser()
                      ? dynamicUser[1]
                      : dynamicUser[0];
                } else {
                  console.log(
                    'this chat has no valid name, it contains no users name'
                  );
                }

                return [obj.id.toString(), obj];
              })
            );
            this.loadingEnd('333');
            console.log(this.chatHeadsname);
            this.chatHeadsname.forEach((data) => {
              this.generalService
                .getUserPhoto(data.dynamicReciever.toString())
                .subscribe(
                  (pic) => {
                    this.insertNewChatheadPic(
                      data.dynamicReciever.toString(),
                      pic[0]
                    );
                  },
                  (err) => {
                    this.insertNewChatheadPic(data.dynamicReciever.name, '');
                  }
                );
            });
            console.log(this.friendsPic);
          },
          (err) => {
            console.log('An error Occured while fetching chat data for a user');
            console.log(err);
            this.loadingEnd('365');
          }
        );
      });
  }

  search(event, v: string) {
    const query = v.toLowerCase();
    requestAnimationFrame(() => {
      Array.from(document.getElementById('listid').children).forEach(
        (item: any) => {
          const shouldShow =
            item.children[1].children[1].children[0].children[0].textContent
              .toLowerCase()
              .indexOf(query) > -1;
          item.style.display = shouldShow ? 'block' : 'none';
        }
      );
    });
  }

  ngOnDestroy(): void {
    //this.generalService.disConnect();
    console.log('destroying chat component ----------------');
    this.subscriptionList.forEach((s) => {
      s.unsubscribe();
    });
    this.subscriptionList.forEach((s) => {
      this.subscriptionList.pop();
    });
  }

  gotoChatDetail(key, name) {
    //we need to save the chat id again incase this function would be called from not active routing map

    this.loadingEnd('397');
    this.generalService.loadingCtrl
      .create({
        message: 'Loading...',
      })
      .then((toast) => {
        console.log('loading started');
        toast.present();
        this.generalService.saveInlocal(this.generalService.currentchatid, key);
        this.generalService.saveInlocal(
          this.generalService.currentrecieverlocal,
          name
        );

        // before going to chat making all messages seen
        this.store.dispatch(
          action.updateCurrentReciever({
            currentReciever: name,
          })
        );
        console.log(
          '######################################################current chat is dispatched ' +
            key
        );
        this.store.dispatch(
          action.updateCurrrentchatid({
            currentchatid: key,
          })
        );
        console.log('go to chat detail of ' + key + ' user ' + name);
        //this.presentMessageModal();
        this.router.navigate(['/message']);
      });
  }

  sortMessages(ml: chatResponse[], type) {
    switch (type) {
      case 'time':
        let noChange: boolean = false;
        while (!noChange) {
          for (let i = 0; i < ml.length; i++) {
            noChange = true;
            if (ml[i].time < ml[i + 1].time) {
              let temp: chatResponse = ml[i];
              ml[i] = ml[i + 1];
              ml[i + 1] = temp;
              noChange = false;
            }
          }
        }

        break;

      default:
        break;
    }
    return ml;
  }

  gotoNewFriend() {
    //this.router.navigate(['newFriend']);
    this.presentNewFriendModal();
  }

  srch(key: string) {
    /*if(key!=""  && this.friends!= null && this.friends.size>0){
      this.generalService.searchUserByName(key).subscribe(us=>{
        this.items=us;
      });
    } else{
      this.items= [];
    } */
  }

  async presentMapModal() {
    const modal = await this.modalController.create({
      component: LocationComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }

  async presentNewFriendModal() {
    const modal = await this.modalController.create({
      component: NewFriendComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }

  async presentMessageModal() {
    const modal = await this.modalController.create({
      component: MessageComponent,
      cssClass: 'my-custom-class-message',
    });
    return await modal.present();
  }

  getUserPicm(key) {
    console.log('chat picture was updated for user ' + key);
    this.friendsPic.forEach((k, d) => {
      console.log(k.substring(0, 100));
      console.log(d.toString().substring(0, 10));
    });
    return this.friendsPic.get(key);
  }

  insertNewChatheadPic(key, pic) {
    console.log(pic);
    if (pic != '' && pic != null) {
      this.friendsPic.set(key, pic);
      console.log('original pic  inserted ############');
    } else {
      this.friendsPic.set(key, this.image);
      console.log(' empty pic  inserted ############');
    }
  }
  gotoProfile(name) {
    this.router.navigate(['/dprofile', name]);
  }

  deletechatidfromchathead(chatid: string, reciever: string) {
    let cr: chatResponse = new chatResponse(
      -1111,
      '',
      1,
      0,
      '',
      true,
      this.generalService.getUser(),
      reciever
    );
    cr.chatid = chatid;
    this.store.dispatch(action.updateViewdMessage({ msgs: [] }));
    this.generalService.sendMessage2(cr, 'chatdelete');
  }

  async presentActionSheet(chatid, reciever) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Chat',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deletechatidfromchathead(chatid, reciever);
            this.generalService.loading_notification_short_hoover(
              'deleting...'
            );
          },
        } /*,  {
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
      } */,
        {
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
