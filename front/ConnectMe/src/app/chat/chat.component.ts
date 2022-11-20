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
  msgs: chatResponse[] = [];
  msgs$: Observable<chatResponse[]>;
  msgsSnglVw: chatResponse = null;
  msgsSnglVw$: Observable<chatResponse>;
  //@ViewChild('cilist') cilist:IonList;
  originalOrder2 = (a, b) => {
    return 0;
  };
  originalOrder = (
    a: KeyValue<number, chatResponse[]>,
    b: KeyValue<number, chatResponse[]>
  ): number => {
    return 0;
  };
  unreadMessagesNo: Map<string, number> = new Map();
  constructor(
    private store: Store<State>,
    private router: Router,
    private generalService: GeneralService,
    private activatedroute: ActivatedRoute
  ) {
    this.currrentUser$ = this.store.select(selector.selectCurrentUser);
    this.msgs$ = this.store.select(selector.selectCurrentChatHeads);
    this.msgsSnglVw$ = this.store.select(selector.selectRecentSentText);
  }

  ngOnInit() {
    let urm: Map<string, number> =
      this.generalService.getFromLocal('unreadMessagesNo')[0];
    console.log(urm);
    if (urm != undefined && urm != null) {
      urm.forEach((data, key) => {
        this.unreadMessagesNo.delete(key);
        this.unreadMessagesNo.set(key, data);
      });
    }
    this.store.dispatch(
      action.updateurrentUser({ currentUser: this.generalService.getUser() })
    );
    console.log('in chat ngoninit');
    this.subscriptionList.push(
      this.activatedroute.paramMap.subscribe((params) => {
        let name = params.get('friend');
        if (name.length > 0 && name.trim() != '' && name != null) {
          this.subscriptionList.push(
            this.generalService
              .getMesssages(this.generalService.getUser())
              .subscribe((ml) => {
                this.store.dispatch(
                  action.updateCurrentChatHeads({
                    currentChatHeads: ml,
                  })
                );
                this.router.navigate(['wait']);
                setTimeout(() => {
                  this.gotoChatDetail(name, this.friends.get(name));
                  this.router.navigate(['/message', name]);
                }, 500);
              })
          );
        }
      })
    );
    this.subscriptionList.push(
      this.currrentUser$.subscribe((s) => {
        this.currentUser = s;

        if (s != '') {
          if (
            this.generalService.client == null ||
            this.generalService.client.connected == false
          ) {
            this.generalService.connect().then(
              (suc) => {
                this.subscriptionList.push(
                  this.generalService.getMesssages(s).subscribe((ml) => {
                    this.store.dispatch(
                      action.updateCurrentChatHeads({
                        currentChatHeads: ml,
                      })
                    );
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
                this.store.dispatch(
                  action.updateCurrentChatHeads({
                    currentChatHeads: ml,
                  })
                );
              })
            );
          }
        }
      })
    );
    this.msgs$.subscribe((ms) => {
      this.msgs = ms;
      this.prepareChatHead(ms);
    });
    this.msgsSnglVw$.subscribe((recentText) => {
      console.log('in chat component updating recent text');
      if (this.friends.size > 0) {
        let finalP = '';

        if (
          recentText.reciever == this.currentUser ||
          recentText.sender == this.currentUser
        ) {
          if (recentText.reciever == this.currentUser) {
            finalP = recentText.sender;
          }
          if (recentText.sender == this.currentUser) {
            finalP = recentText.reciever;
          }
        }
        //this.friends.get(finalP.toString()).push(recentText);

        let tempfriends: Map<string, chatResponse[]> = new Map();
        this.friends.forEach((d, k) => {
          tempfriends.set(k.toString(), d);
        });
        this.friends.clear();
        let temp: chatResponse[] = [];
        try {
          temp = tempfriends.get(finalP);
          temp.push(recentText);
          // checking if it is a reciever's side of a message sent by this user
          console.log(recentText.sender != this.currentUser);
          console.log(this.currentUser);
          console.log(recentText.sender);
          console.log(recentText.reciever);
          if (recentText.sender != this.currentUser) {
            let thisUsersUnreadMessageNo: number =
              this.unreadMessagesNo.get(finalP);
            this.unreadMessagesNo.delete(finalP);
            if (thisUsersUnreadMessageNo == undefined) {
              thisUsersUnreadMessageNo = 0;
            }
            thisUsersUnreadMessageNo = thisUsersUnreadMessageNo + 1;
            this.unreadMessagesNo.set(finalP, thisUsersUnreadMessageNo);
            this.generalService.saveInlocal(
              'unreadMessagesNo',
              this.unreadMessagesNo
            );
          }
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
      }
    });
  }
  prepareChatHead(ml: chatResponse[]) {
    this.friends = new Map();
    this.generalService
      .getUserSpokenTo(this.currentUser)
      .subscribe((spkNames) => {
        let patners: string[] = spkNames.spokento.split(' ');

        // let tempfriends: Map<string, chatResponse[]> = new Map();
        patners.forEach((name) => {
          if (name.length > 0 && name != ' ' && name != this.currentUser) {
            let msgsTemp: chatResponse[] = [];

            ml.forEach((umsg) => {
              if (
                (umsg.reciever == name && umsg.sender == this.currentUser) ||
                (umsg.reciever == this.currentUser && umsg.sender == name)
              ) {
                msgsTemp.push(umsg);
              }
            });

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
    console.log('input happened');
    console.log(v);
    console.log(Array.from(document.getElementById('listid').children));
    requestAnimationFrame(() => {
      Array.from(document.getElementById('listid').children).forEach(
        (item: any) => {
          console.log(item);
          console.log(item.children[1].children[0].textContent.toLowerCase());
          const shouldShow =
            item.children[1].children[0].textContent
              .toLowerCase()
              .indexOf(query) > -1;
          console.log(shouldShow);
          item.style.display = shouldShow ? 'block' : 'none';
        }
      );
    });
  }

  ngOnDestroy(): void {
    //this.generalService.disConnect();
    this.subscriptionList.forEach((s) => {
      s.unsubscribe();
    });
  }

  gotoChatDetail(key, vmsgs: chatResponse[]) {
    this.unreadMessagesNo.delete(key);
    this.generalService.saveInlocal(key, this.unreadMessagesNo);
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
