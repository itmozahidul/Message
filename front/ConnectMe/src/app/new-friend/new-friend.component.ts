import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonList, ModalController } from '@ionic/angular';
import { chatResponse } from '../DTO/chatResponse';
import { GeneralService } from '../service/general.service';
import { Store } from '@ngrx/store';
import { State } from '../store/reducer';
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
    private generalService: GeneralService,
    public modalController: ModalController
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

  endModal() {
    this.modalController.dismiss();
  }

  gotoChatDetail(newPerson) {
    if (newPerson != this.generalService.getUser()) {
      let data = {
        name: newPerson,
      };
      this.generalService.createChat(newPerson).subscribe(
        (suc) => {
          this.generalService.saveInlocal(
            this.generalService.currentchatid,
            suc.id.toString()
          );
          console.log(suc);
          this.endModal();
          this.router.navigate(['/chat', newPerson]);
          console.log(suc);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  gotoProfile(name) {
    console.log('going to profile of ' + name);
    this.endModal();
    this.router.navigate(['/dprofile', name]);
  }

  ngOnDestroy() {
    this.subscriptionList = [];
  }
}
