import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonList } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { chatResponse } from '../DTO/chatResponse';
import { GeneralService } from '../service/general.service';
import { State } from '../store/reducer';
import * as selector from '../store/selector';
import * as action from '../store/action';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  hasError: boolean = false;
  errommsg = '';
  currentUser: string = '';
  subscriptionList: any[] = [];
  currrentUser$: Observable<string>;
  items: any[] = [];
  friends: Map<string, chatResponse[]> = new Map();
  currentChatHeads: chatResponse[] = [];
  currentChatHeads$: Observable<chatResponse[]>;
  msgsSnglVw: chatResponse = null;
  msgsSnglVw$: Observable<chatResponse>;
  //@ViewChild('cilist') cilist:IonList;
  originalOrder2() {
    return 0;
  }
  originalOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>) => {
    return 0;
  };
  unreadMessagesNo: Map<string, number[]> = new Map();
  reciever: string = null;
  reciever$: Observable<string>;
  constructor(
    private store: Store<State>,
    private router: Router,
    private generalService: GeneralService,
    private activatedroute: ActivatedRoute
  ) {
    this.currrentUser$ = this.store.select(selector.selectCurrentUser);
    this.currentChatHeads$ = this.store.select(selector.selectCurrentChatHeads);
    this.msgsSnglVw$ = this.store.select(selector.selectRecentSentTextChat);
    this.reciever$ = this.store.select(selector.selectCurrentReciever);
  }

  ngOnInit() {
    console.log('in chat ngoninit');
    //this updating current user will be helpfull if user refreshes the page unless it wont have any impact because login is doing it
    // this.store.dispatch(
    //   action.updateurrentUser({ currentUser: this.generalService.getUser() })
    // );
    //in chat list there is no reciever
    // this.store.dispatch(
    //   action.updateCurrentReciever({
    //     currentReciever: '',
    //   })
    // );
    this.store.dispatch(
      action.updateCurrentReciever({
        currentReciever: '',
      })
    );

    this.subscriptionList.push(
      this.reciever$.subscribe((data) => {
        this.reciever = data;
      })
    );

    this.subscriptionList.push(
      this.activatedroute.paramMap.subscribe((params) => {
        console.log('in chat and param url is');
        let name = params.get('friend');
        if (
          name != undefined &&
          name != null &&
          name.length > 0 &&
          name.trim() != ''
        ) {
          this.subscriptionList.push(
            this.generalService
              .getMesssages(this.generalService.getUser())
              .subscribe((ml) => {
                this.prepareChatHead(ml);
                //this.router.navigate(['wait']);
                setTimeout(() => {
                  this.gotoChatDetail(name);
                  this.router.navigate(['/message', name]);
                }, 500);
              })
          );
        } else {
          let s = this.generalService.getUser();

          if (s != '') {
            if (
              this.generalService.client == null ||
              this.generalService.client.connected == false
            ) {
              this.generalService.connect().then(
                (suc) => {
                  this.subscriptionList.push(
                    this.generalService.getMesssages(s).subscribe((ml) => {
                      this.prepareChatHead(ml);
                    })
                  );
                },
                (err) => {
                  this.hasError = true;
                  console.log(err);
                  this.errommsg = 'can not connect';
                }
              );
            } else {
              this.subscriptionList.push(
                this.generalService.getMesssages(s).subscribe((ml) => {
                  this.prepareChatHead(ml);
                })
              );
            }
          }
        }
      })
    );
    this.subscriptionList.push(
      this.currrentUser$.subscribe((s) => {
        console.log('current user in chat ');
      })
    );

    // this.subscriptionList.push(
    //   this.currentChatHeads$.subscribe((ms) => {
    //     this.currentChatHeads = ms;
    //     this.prepareChatHead(ms);
    //   })
    // );
    this.subscriptionList.push(
      this.msgsSnglVw$.subscribe((recentText) => {
        //debugger;
        console.log('in chat component updating recent text');
        if (recentText != null) {
          let finalP = '';

          if (
            recentText.reciever == this.generalService.getUser() ||
            recentText.sender == this.generalService.getUser()
          ) {
            if (recentText.reciever == this.generalService.getUser()) {
              finalP = recentText.sender;
            }
            if (recentText.sender == this.generalService.getUser()) {
              finalP = recentText.reciever;
            }
          }
          if (this.friends.size > 0) {
            //this.friends.get(finalP.toString()).push(recentText);

            let tempfriends: Map<string, chatResponse[]> = new Map();
            this.friends.forEach((d, k) => {
              tempfriends.set(k.toString(), d);
            });
            this.friends.clear();
            let temp: chatResponse[] = [];
            try {
              temp = tempfriends.get(finalP);
              if (temp == undefined || temp == null || temp.length < 0) {
                temp = [];
              }

              // checking if it is a reciever's side of a message sent by this user
              console.log(recentText.sender != this.generalService.getUser());
              console.log('current user : ' + this.generalService.getUser());
              console.log('new message sender : ' + recentText.sender);
              console.log('new message reciever : ' + recentText.reciever);
              console.log('finalp : ' + finalP);
              console.log('reciever : ' + this.reciever);
              if (recentText.sender != this.generalService.getUser()) {
                //this condition tells when someone who is not chatting with the user sent a message
                //If the current user is a sender of a message then he needs to be in conversation with that reciver right now.thats why this
                //case was not implemented here
                if (this.reciever != finalP) {
                  console.log('msg not seen');
                  let thisUsersUnreadMessageNo: number[] =
                    this.unreadMessagesNo.get(finalP);
                  this.unreadMessagesNo.delete(finalP);
                  if (thisUsersUnreadMessageNo == undefined) {
                    thisUsersUnreadMessageNo = [];
                  }
                  thisUsersUnreadMessageNo.push(recentText.id);
                  console.log('got increase by 1 #########################');
                  this.unreadMessagesNo.set(finalP, thisUsersUnreadMessageNo);
                  console.log(this.unreadMessagesNo.get(finalP).length);
                } else {
                  console.log('msg is seen');
                  console.log(recentText.id);
                  recentText.seen = true;
                  //debugger;
                  this.generalService
                    .updateMsgSeen(recentText.id, true)
                    .subscribe(
                      (suc) => {
                        console.log(suc);
                      },
                      (fail) => {
                        console.log(fail);
                      }
                    );
                }
              }
              //if the sender is the current user then seen attribute is irrelavant
              // if (recentText.sender == this.generalService.getUser()) {
              //   recentText.seen = true;
              //   this.generalService.updateMsgSeen(recentText.id, true);
              // }

              temp.push(recentText);
            } catch (error) {
              console.log(error);
              temp = [];
              temp.push(recentText);
            }

            this.friends.set(finalP.toString(), temp);

            tempfriends.delete(finalP);
            tempfriends.forEach((data, key) => {
              this.friends.set(key.toString(), data);
            });
          } else {
            let temp: chatResponse[] = [];
            temp.push(recentText);
            this.friends.set(finalP.toString(), temp);
          }
        }
      })
    );
  }
  prepareChatHead(ml: chatResponse[]) {
    this.friends = new Map();
    this.generalService
      .getUserSpokenTo(this.generalService.getUser())
      .subscribe((spkNames) => {
        let patners: string[] = spkNames.spokento.split(' ');

        // let tempfriends: Map<string, chatResponse[]> = new Map();
        patners.forEach((name) => {
          if (
            name.length > 0 &&
            name != ' ' &&
            name != this.generalService.getUser()
          ) {
            let msgsTemp: chatResponse[] = [];

            let thisUsersUnreadMessageNo: number[] = [];
            //   this.unreadMessagesNo.get(name);
            // this.unreadMessagesNo.delete(name);
            // if (thisUsersUnreadMessageNo == undefined) {
            //   thisUsersUnreadMessageNo = 0;
            // }

            ml.forEach((umsg) => {
              if (
                (umsg.reciever == name &&
                  umsg.sender == this.generalService.getUser()) ||
                (umsg.reciever == this.generalService.getUser() &&
                  umsg.sender == name)
              ) {
                msgsTemp.push(umsg);
                if (
                  !umsg.seen &&
                  umsg.sender != this.generalService.getUser()
                ) {
                  thisUsersUnreadMessageNo.push(umsg.id);
                }
              }
            });
            this.unreadMessagesNo.set(name, thisUsersUnreadMessageNo);

            if (msgsTemp.length > 0) {
              msgsTemp = this.sortMessages(msgsTemp, 'Time');
              this.friends.set(name.toString(), msgsTemp);
            }
          }
        });
        /*let finalP = '';
         if (
          ml[ml.length - 1].reciever == this.currentUser ||
          ml[ml.length - 1].sender == this.currentUser
        ) {
          if (ml[ml.length - 1].reciever == this.currentUser) {
            this.friends.set(
              ml[ml.length - 1].sender.toString(),
              tempfriends.get(ml[ml.length - 1].sender)
            );
            finalP = ml[ml.length - 1].sender;
            console.log(finalP);
          }
          if (ml[ml.length - 1].sender == this.currentUser) {
            this.friends.set(
              ml[ml.length - 1].reciever.toString(),
              tempfriends.get(ml[ml.length - 1].reciever)
            );
            finalP = ml[ml.length - 1].reciever;
            console.log(finalP);
          }
        } 

        patners.forEach((p) => {
          if (p != finalP) {
            this.friends.set(p.toString(), tempfriends.get(p));
          }
        });*/
        //commented out is replaced by following
      });

    //this.friends = this.sortChatHeads(this.friends,'time');
    this.generalService.saveInlocal('friends', this.friends);
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
    console.log('destroying chat component ----------------');
    this.subscriptionList.forEach((s) => {
      s.unsubscribe();
    });
  }

  gotoChatDetail(key) {
    console.log('go to chat detail');

    console.log(key);
    let vmsgs: chatResponse[] = this.friends.get(key);
    let vmsgsMap: Map<number, chatResponse> = new Map();

    if (vmsgs == undefined || vmsgs == null || vmsgs.length < 1) {
      vmsgs = [];
    }
    vmsgs.forEach((d) => {
      vmsgsMap.set(d.id, d);
    });

    let unms: number[] = this.unreadMessagesNo.get(key);

    if (unms != undefined && unms != null && unms.length > 0) {
      unms.forEach((i) => {
        vmsgsMap.get(i).seen = true;

        this.generalService.updateMsgSeen(i, true).subscribe(
          (suc) => {
            console.log(suc);
          },
          (fail) => {
            console.log(fail);
          }
        );
      });
    }
    this.store.dispatch(
      action.updateViewdMessage({
        msgs: vmsgs,
      })
    );
    //this.generalService.connect();
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
    this.router.navigate(['newFriend']);
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
}
