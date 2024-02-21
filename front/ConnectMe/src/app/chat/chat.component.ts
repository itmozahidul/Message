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
  originalOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>) => {
    return 0;
  };
  unreadMessagesNo: Map<string, number> = new Map();
  reciever: string = null;
  reciever$: Observable<string>;
  chatid: string = '';
  chatid$: Observable<string>;
  deletedchatid: string = '';
  deletedchatid$: Observable<string>;
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
    console.log('in chat ngoninit');
    this.loadingStart('Loading..');
  }

  loadingStart(msg) {
    this.generalService.loadingCtrl
      .create({
        message: msg,
        duration: this.generalService.notificationDuration,
      })
      .then((toast) => {
        toast.present();
        this.init_observable_data();
      });
  }

  loadingStartGoingToMessageComponent(msg) {
    this.loadingEnd();
    this.generalService.loadingCtrl
      .create({
        message: msg,
      })
      .then((toast) => {
        console.log('loading started');
        toast.present();
      });
  }
  init_observable_data() {
    console.log('chat component init');

    this.subscriptionList.push(
      this.reciever$.subscribe((data) => {
        this.reciever = data;
        if (data == '') {
          this.disable = false;
          this.get_Data_From_the_backend();
        } else {
          this.loadingEnd();
        }
      })
    );

    /*this.subscriptionList.push(
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
    );*/
    this.subscriptionList.push(
      this.currrentUser$.subscribe((s) => {
        console.log('current user in chat ');
      })
    );

    this.subscriptionList.push(
      this.deletedchatid$.subscribe((m) => {
        this.deletedchatid = m;
        this.chatHeadsname.delete(m);
        this.unreadMessagesNo.delete(m);
        this.loadingEnd();
      })
    );

    this.subscriptionList.push(
      this.chatid$.subscribe((m) => {
        this.chatid = m;
        if (m != null && m != undefined && m != '') {
          if (this.chatHeadsname.has(m)) {
            this.chatHeadsname.get(m).unreadMessageNo = 0;
            let cr: chatResponse = new chatResponse(
              -1111,
              '',
              '',
              true,
              this.generalService.getUser(),
              this.reciever
            );
            cr.chatid = m;
            this.generalService.sendMessage2(cr, 'msgseennotifyall');
          }
        }
      })
    );

    this.subscriptionList.push(
      this.msgsSnglVw$.subscribe((recentText) => {
        //debugger;

        if (recentText != null) {
          console.log('in chat component updating recent text');
          if (
            this.chatHeadsname.size > 0 &&
            this.chatHeadsname.has(recentText.chatid)
          ) {
            console.log('chat id already exist in chathead list');
            if (recentText.sender != this.generalService.getUser()) {
              if (this.reciever != recentText.sender) {
                console.log('unread message no got increased by 1');
                this.chatHeadsname.get(recentText.chatid).unreadMessageNo++;
              }
            }

            this.chatHeadsname.get(recentText.chatid).rsp.unshift(recentText);
          } else {
            console.log('new chat id , addind it to chathead list');
            this.generalService
              .getChatHeadinfobychatid(recentText.chatid)
              .subscribe(
                (suc) => {
                  if (this.reciever != recentText.sender) {
                    console.log('unread message no got increased by 1');
                    suc.unreadMessageNo++;
                  }
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
  loadingEnd() {
    console.log('loading ended');

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
        this.generalService.connect().then(
          (suc) => {
            this.prepareChatHead(s, 0);
          },
          (err) => {
            this.hasError = true;
            console.log(err);
            this.errommsg = 'connection failed!';
            this.loadingEnd();
          }
        );
      } else {
        // if websoket connection is there then as usual prosess
        this.prepareChatHead(s, 0);
      }
    } else {
      //TODO when no user is in local storage?
      this.loadingEnd();
      this.generalService.loading_notification_short_hoover(
        'Session is expeired. Trying to reconnect.'
      );

      this.router.navigate(['/login']);
    }
  }

  prepareChatHead(name, opt) {
    this.generalService
      .getChatHeadinfo(this.generalService.getUser())
      .subscribe(
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
          this.loadingEnd();
          console.log(this.chatHeadsname);
          if (opt == 1) {
            this.gotoChatDetail(
              this.generalService.getFromLocal(
                this.generalService.currentchatid
              ),
              name
            );
            this.loadingEnd();
          }
          suc.forEach((data) => {
            this.generalService.getUserPhoto(data.name.toString()).subscribe(
              (pic) => {
                this.insertNewChatheadPic(data.name, pic[0]);
              },
              (err) => {
                this.insertNewChatheadPic(data.name, '');
              }
            );
          });
        },
        (err) => {
          console.log('An error Occured while fetching chat data for a user');
          console.log(err);
          this.loadingEnd();
        }
      );
  }

  search(event, v: string) {
    const query = v.toLowerCase();
    requestAnimationFrame(() => {
      Array.from(document.getElementById('listid').children).forEach(
        (item: any) => {
          const shouldShow =
            item.children[1].children[0].textContent
              .toLowerCase()
              .indexOf(query) > -1;
          item.style.display = shouldShow ? 'block' : 'none';
        }
      );
    });
  }

  ngOnDestroy(): void {
    //this.generalService.disConnect();
    /*console.log('destroying chat component ----------------');
    this.subscriptionList.forEach((s) => {
      s.unsubscribe();
    });*/
  }

  gotoChatDetail(key, name) {
    //we need to save the chat id again incase this function would be called from not active routing map
    this.loadingStartGoingToMessageComponent('loadin...');
    console.log('go to chat detail of ' + key);
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
    this.store.dispatch(
      action.updateCurrrentchatid({
        currentchatid: key,
      })
    );
    console.log('go to chat detail of ' + key);
    //this.presentMessageModal();
    this.router.navigate(['/message']);
  }
  // sortChatHeads(chatHead:Map<string, chatResponse[]> ,  key: string ){
  //   switch (key) {
  //     case 'time':
  //       let temp : chatResponse[] = [];
  //       let tempKey = "";
  //       let keys:string[] = [];
  //       chatHead.forEach((d,k)=>{
  //         keys.fill(k);
  //       })
  //       for(let i=0;i<chatHead.size-1;i++){
  //         if(chatHead.get(keys[i])[chatHead.size-1].time>chatHead.get(keys[i+1])[chatHead.size-1].time){
  //            temp= chatHead.get(keys[i]);
  //            tempKey = keys[i];
  //            chatHead.delete(keys[i]);
  //            chatHead.set(keys[i],);
  //         }
  //       }
  //       break;

  //     default:
  //       break;
  //   }
  //   return chatHead;
  // }
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
    if (!this.friendsPic.has(key)) {
      if (this.pic == '') {
        this.pic = pic;
      } else {
        console.log(this.pic == pic);
      }
      console.log('pic  inserted ############');
      this.friendsPic.set(key, pic);
    }
  }
  gotoProfile(name) {
    this.router.navigate(['/dprofile', name]);
  }

  deletechatidfromchathead(chatid: string, reciever: string) {
    let cr: chatResponse = new chatResponse(
      -1111,
      '',
      '',
      true,
      this.generalService.getUser(),
      reciever
    );
    cr.chatid = chatid;
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
