import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GeneralService } from '../service/general.service';
import { State } from '../store/reducer';
import * as selector from '../store/selector';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  currentUser: string = '';
  subscriptionList: any[] = [];
  currrentUser$: Observable<string>;
  constructor(
    private store: Store<State>,
    private router: Router,
    private generalService: GeneralService
  ) {
    this.currrentUser$ = this.store.select(selector.selectCurrentUser);
  }

  ngOnInit() {
    this.subscriptionList.push(
      this.currrentUser$.subscribe((s) => {
        this.currentUser = s;
        if ((s = '')) {
          this.router.navigate(['login']);
        }
      })
    );
  }

  logout() {
    this.generalService.disConnect().then(
      (suc) => {
        this.router.navigate(['login']);
      },
      (fail) => {
        console.log('not loged out');
        console.log(fail);
      }
    );
  }
}
