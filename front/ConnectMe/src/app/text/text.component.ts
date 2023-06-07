import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { GeneralService } from '../service/general.service';
import { Observable } from 'rxjs';
import * as selector from '../store/selector';
import * as action from '../store/action';
import { Store } from '@ngrx/store';
import { State } from '../store/reducer';
//import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  @Input() text: string = '';
  @Input() sender: string = '';
  @Input() reciever: string = '';
  @Input() time: string = '';
  @Input() seen: boolean = false;
  @Input() user: string = '';
  @Input() data: string = '';
  @Input() type: string = '';
  @ViewChild('cnt', { read: ElementRef }) cnt: ElementRef;
  isLeftSide: boolean = true;
  subscriptionList = [];
  image: string = 'assets/avatar.png';
  image$: Observable<string>;
  rimage: string = 'assets/avatar.png';
  rimage$: Observable<string>;
  constructor(
    private generalService: GeneralService,
    private router: Router,
    public loadingCtrl: LoadingController,
    private store: Store<State>
  ) {
    this.image$ = this.store.select(selector.selectUserImage);
    this.rimage$ = this.store.select(selector.selectRecieverImage);
  }

  ngOnInit() {
    if (this.type == 'file') {
    }
    // if (
    //   this.text.endsWith('png') ||
    //   this.text.endsWith('PNG') ||
    //   this.text.endsWith('jpeg') ||
    //   this.text.endsWith('JPEG')
    // ) {
    //   let content = this.generalService.unit8ArrayEncode(this.data);
    //   this.type = 'image';
    //   this.data = URL.createObjectURL(
    //     new Blob([content.buffer], { type: 'image/png' } /* (1) */)
    //   );
    // }

    this.isLeftSide = this.leftSide();

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
    this.subscriptionList.push(
      this.rimage$.subscribe((rcvimg) => {
        this.rimage = rcvimg;
      })
    );
  }

  loadingEnd() {
    console.log('loading ended');
    this.loadingCtrl.getTop().then(
      (succ) => {
        if (succ) {
          this.loadingCtrl.dismiss().then(
            (suc) => {
              if (suc) {
                console.log('loading ctrl end');
              } else {
                console.log('loading ctrl end Failed');
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      },
      (errr) => {
        console.log(errr);
      }
    );
  }

  leftSide() {
    return this.sender === this.user ? false : true;
  }
}
