import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from './store/reducer';
import * as selector from './store/selector';
import { GeneralService } from './service/general.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
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
      })
    );
  }
}
