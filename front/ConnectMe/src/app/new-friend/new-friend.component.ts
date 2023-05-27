import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonList } from '@ionic/angular';
import { chatResponse } from '../DTO/chatResponse';
import { GeneralService } from '../service/general.service';
import { Store } from '@ngrx/store';
import { State } from '../Store/reducer';
import { Router } from '@angular/router';
import * as selector from '../store/selector';
import * as action from '../store/action';

@Component({
  selector: 'app-new-friend',
  templateUrl: './new-friend.component.html',
  styleUrls: ['./new-friend.component.scss'],
})
export class NewFriendComponent implements OnInit, AfterViewInit {
  @ViewChild('cilist') cilist: IonList;

  subscriptionList: any[];
  items: any[];
  constructor(
    private router: Router,
    private store: Store<State>,
    private generalService: GeneralService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  srch(key: string) {
    console.log('searching');
    console.log(key);
    if (key != '') {
      this.generalService.searchUserByName(key).subscribe(
        (us) => {
          console.log(us);
          this.items = us;
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.items = [];
    }
  }

  gotoChatDetail(newPerson) {
    if (newPerson != this.generalService.getUser()) {
      this.router.navigate(['/chat', newPerson]);
    }

    //this part is needed if ,the chats data has to be handeled here.
    /* this.store.dispatch(
      action.updateViewdMessage({
        msgs: [],
      })
    );
    this.generalService.getMesssagesbyUser(newPerson).subscribe(
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
      }
    ); */

    //this.generalService.connect();
  }

  ngOnDestroy() {
    this.subscriptionList = [];
  }
}
