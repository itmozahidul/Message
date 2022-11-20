import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MaxLengthValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { chatResponse } from '../DTO/chatResponse';
import { Message } from '../Model/message';
import { GeneralService } from '../service/general.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { State } from '../Store/reducer';
import * as selector from '../store/selector';
import * as action from '../store/action';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy, AfterViewInit {
  msgs: chatResponse[] = [];
  msgs$: Observable<chatResponse[]>;
  msgsSnglVw: chatResponse = null;
  msgsSnglVw$: Observable<chatResponse>;
  newMsg: Message = null;
  reciever: string = null;
  reciever$: Observable<string>;
  subscriptionList = [];
  @ViewChild('cnt', { read: ElementRef }) cnt: ElementRef;

  constructor(
    private store: Store<State>,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private generalService: GeneralService,
    private http: HttpClient
  ) {
    this.msgs$ = this.store.select(selector.selectViewMessage);
    this.msgsSnglVw$ = this.store.select(selector.selectRecentSentText);
    this.reciever$ = this.store.select(selector.selectCurrentReciever);
  }
  ngAfterViewInit(): void {
    console.log('in ng after view intit');
    setTimeout(() => {
      this.scrollBottom(1000);
    }, 1000);
  }
  public scrollBottom(v): void {
    if (this.router.url.startsWith('/message')) {
      console.log('go to bottom page part');
      this.cnt.nativeElement.scrollToBottom(v);
    }
  }
  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => {
      s.unsubscribe();
    });
    //this.generalService.disConnect();
    this.store.dispatch(
      action.updateCurrentReciever({
        currentReciever: '',
      })
    );
    this.router.navigate(['/chat', '']);
  }

  ngOnInit() {
    console.log('ngOninit');

    this.subscriptionList.push(
      this.activatedroute.paramMap.subscribe((params) => {
        this.reciever = params.get('friend');
        this.store.dispatch(
          action.updateCurrentReciever({
            currentReciever: this.reciever,
          })
        );
      })
    );

    this.msgsSnglVw$.subscribe((data) => {
      setTimeout(() => {
        this.scrollBottom(1000);
      }, 1);
    });

    this.subscriptionList.push(
      this.msgs$.subscribe((m) => {
        console.log('in message component on reload');
        if (m.length > 0) {
          // this may never be true, but kept it incase i need it
          if (
            this.generalService.client == null ||
            this.generalService.client.connected == false
          ) {
            this.generalService.connect();
          }
          this.msgs = m;
        } else {
          //this.router.navigateByUrl('/chat');
          //this.router.navigate(['/chat', '']);
          //this is needed if reload for message component needs to work
          /* this.generalService.getMesssagesbyUser(this.reciever).subscribe(
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
              this.router.navigateByUrl('/chat');
            }
          ); */
        }
      })
    );

    /* this.generalService
      .getMesssagesbyUser(this.reciever)
      .subscribe((aktualMsgs) => {
        console.log('got new msg');
        this.store.dispatch(
          action.updateViewdMessage({
            msgs: [],
          })
        );
        this.store.dispatch(
          action.updateViewdMessage({
            msgs: aktualMsgs,
          })
        ),
          (err) => {
            console.log(err);
          };
      }); */

    /* this.msgs.push(
      new chatResponse(
        '12.00',
        'Hi how are you?',
        false,
        this.generalService.getUser(),
        'shakil'
      )
    );
    this.msgs.push(
      new chatResponse(
        '12.00',
        'I am fine and you?',
        false,
        'shakil',
        this.generalService.getUser()
      )
    ); */
  }

  send(data) {
    let input: string = data.value;
    console.log(data.value);
    if (
      input != null &&
      input.length > 0 &&
      input.trim() != '' &&
      input.trim() != ' '
    ) {
      this.newMsg = new chatResponse(
        '00.00',
        data.value,
        false,
        this.generalService.getUser(),
        this.reciever
      );
      this.generalService.sendMessage(this.newMsg);
    }
    data.value = '';
  }
}
