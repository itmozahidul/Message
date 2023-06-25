import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as selector from '../store/selector';
import * as action from '../store/action';
import { Store } from '@ngrx/store';
import { State } from '../store/reducer';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-display-image',
  templateUrl: './display-image.component.html',
  styleUrls: ['./display-image.component.scss'],
})
export class DisplayImageComponent implements OnInit, AfterViewInit, OnDestroy {
  image: string = 'assets/avatar.png';
  image$: Observable<string>;
  constructor(
    private generalService: GeneralService,
    private router: Router,
    public loadingCtrl: LoadingController,
    private store: Store<State>,
    public modalController: ModalController
  ) {
    this.image$ = this.store.select(selector.selectDisplayPic);
  }

  ngOnInit() {
    this.image$.subscribe((data) => {
      if (data != '') {
        this.image = data;
      }
    });
  }
  ngAfterViewInit(): void {
    this.loadingEnd();
  }

  async loadingEnd() {
    return await this.loadingCtrl.dismiss();
  }

  close() {
    this.modalController.dismiss();
    this.image = '';
    this.store.dispatch(action.updateDisplayPic({ displayPic: '' }));
  }

  ngOnDestroy() {
    this.image = '';
    this.store.dispatch(action.updateDisplayPic({ displayPic: '' }));
  }
}
