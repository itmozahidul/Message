import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Location } from '@angular/common';
import { MaxLengthValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { chatResponse } from '../DTO/chatResponse';
import { Message } from '../model/message';
import { GeneralService } from '../service/general.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { State } from '../store/reducer';
import * as selector from '../store/selector';
import * as action from '../store/action';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment.prod';
import * as Stomp from 'stompjs';
import {
  ActionSheetController,
  IonContent,
  IonInfiniteScroll,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { SelectImageComponent } from '../select-image/select-image.component';

import { RecordAudioComponent } from '../record-audio/record-audio.component';
import { NewFriendComponent } from '../new-friend/new-friend.component';
import { Chathead } from '../DTO/chatHead';
import * as dragmaker from '../../assets/script/drag.js';
import { actionEvent } from '../DTO/actionEvent';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit, AfterViewInit {
  state = -1;
  offer: string;
  offer$: Observable<string>;
  answer: string;
  answer$: Observable<string>;
  candidate: string;
  candidate$: Observable<string>;
  reciever: string = null;
  reciever$: Observable<string>;
  currentUser: string = '';
  currentUser$: Observable<string>;
  image: string = 'assets/avatar.png';
  image$: Observable<string>;
  rimage: string = 'assets/avatar.png';
  rimage$: Observable<string>;
  callend: number = 0;
  callend$: Observable<number>;
  subscriptionList: Subscription[] = [];
  peercon: RTCPeerConnection = null;
  peercon$: Observable<RTCPeerConnection>;
  txt: string = '';
  callingurl = 'assets/video/calling.mp4';
  configuration: RTCConfiguration = {
    iceServers: [
      {
        urls: 'stun:stun2.1.google.com:19302',
      },
    ],
  };
  dataChannel: RTCDataChannel;
  peerConnection: RTCPeerConnection;
  viddata: HTMLVideoElement;
  @ViewChild('disp1', { read: ElementRef }) selfView: ElementRef;
  @ViewChild('disp2', { read: ElementRef }) remoteView: ElementRef;
  stream: MediaStream;
  temp = null;
  connectTryNo = 0;
  wsendpoint = environment.webSoket;
  topic_single: string = '/users/call/reply';
  client: Stomp.Client = null;
  webSoket: WebSocket = null;
  talker = '';

  constructor(
    private store: Store<State>,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private generalService: GeneralService,
    private http: HttpClient,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public location: Location
  ) {
    this.reciever$ = this.store.select(selector.selectCurrentReciever);
    this.currentUser$ = this.store.select(selector.selectCurrentUser);
    this.image$ = this.store.select(selector.selectUserImage);
    this.rimage$ = this.store.select(selector.selectRecieverImage);
    this.offer$ = this.store.select(selector.selectOffer);
    this.answer$ = this.store.select(selector.selectAns);
    this.candidate$ = this.store.select(selector.selectCand);
    this.callend$ = this.store.select(selector.selectCallend);
    this.peercon$ = this.store.select(selector.selectPc);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.start();
      this.remoteView.nativeElement.click();
    }, 2000);
  }

  ngOnInit() {
    this.subscreibcurrentuser();
    this.subscreibtoreciever();
    this.subscreib_current_user_image();
    this.subscreib_reciever_image();
    this.subscreib_offer();
    this.subscreib_ans();
    this.subscreib_cand();
    this.subscreibcallend();
    this.subscreib_router();
  }
  subscreib_reciever_image() {
    this.subscriptionList.push(
      this.rimage$.subscribe((d) => {
        this.rimage = d;
      })
    );
  }

  subscreib_router() {
    //debugger;
    this.activatedroute.paramMap.subscribe((params) => {
      let d = params.get('user');
      if (d != '') {
        console.log(
          '##########################################################'
        );
        console.log(
          '#####################new talker ' + d + '#######################'
        );
        console.log(
          '##########################################################'
        );
        this.talker = d;
        this.connect(d);
      }
    });
  }

  makedragable(ele) {
    dragmaker.init(ele);
  }

  send() {
    this.dataChannel.send(this.txt);
  }
  subscreib_current_user_image() {
    this.subscriptionList.push(
      this.image$.subscribe((d) => {
        this.image = d;
      })
    );
  }

  subscreib_Peerconnection() {
    this.subscriptionList.push(
      this.peercon$.subscribe((d) => {
        this.peercon = d;
      })
    );
  }
  subscreibtoreciever() {
    this.subscriptionList.push(
      this.reciever$.subscribe((d) => {
        this.reciever = d;
        if (d != '') {
        }
      })
    );
  }
  subscreibcurrentuser() {
    this.subscriptionList.push(
      this.currentUser$.subscribe((d) => {
        this.currentUser = d;
      })
    );
  }

  subscreibcallend() {
    this.subscriptionList.push(
      this.callend$.subscribe((d) => {
        this.callend = d;

        if (d == 1) {
          this.drop_call('other');
          this.store.dispatch(action.updateCallend({ callend: 0 }));
        }
      })
    );
  }

  subscreib_offer() {
    this.subscriptionList.push(
      this.offer$.subscribe((strobj) => {
        if (strobj != '') {
          this.offer = strobj;
          this.handelOffer(strobj);
        }
        console.log('in recieveing offer ');
      })
    );
  }

  drop_call(side) {
    try {
      if (side == 'me') {
        this.sendCallendMessage(1, this.talker, 'end');
      }
      this.terminateWebrtcCon();
      setTimeout(() => {
        this.talker = '';
        try {
          if (this.stream != null) {
            if (this.stream.getAudioTracks().length > 0) {
              this.stream.getAudioTracks().forEach((t) => {
                t.stop();
              });
            }
            if (this.stream.getVideoTracks().length > 0) {
              this.stream.getVideoTracks().forEach((t) => {
                t.stop();
              });
            }
            if (this.stream.getTracks().length > 0) {
              this.stream.getTracks().forEach((t) => {
                t.stop();
              });
            }
          }

          this.unsub_subs();
          this.store.dispatch(action.updateCallend({ callend: 0 }));
          setTimeout(() => {
            this.router.navigate(['chat']);
          }, 200);
        } catch (error) {
          console.log(error);
        }
      }, 200);
    } catch (error) {
      console.log(error);
    }
  }
  unsub_subs() {
    this.subscriptionList.forEach((s) => {
      s.unsubscribe();
    });
    this.subscriptionList.forEach((s) => {
      this.subscriptionList.pop();
    });
  }

  subscreib_ans() {
    this.subscriptionList.push(
      this.answer$.subscribe((strobj) => {
        this.answer = strobj;
        if (strobj != '') {
          if (this.client != null) {
            this.handelAnswer(strobj);
          } else {
            this.connect(this.talker);
          }
        }
      })
    );
  }

  subscreib_cand() {
    this.subscriptionList.push(
      this.candidate$.subscribe((strobj) => {
        this.candidate = strobj;
        if (strobj != '') {
          this.handelCandidate(strobj);
        }
      })
    );
  }

  back() {
    this.drop_call('me');
  }

  sendCallendMessage(text, rcv, type) {
    if (
      text != null &&
      text != '' &&
      rcv != '' &&
      type != '' &&
      this.generalService.getUser() != ''
    ) {
      let newMsge = new chatResponse(
        -1111,
        '00.00',
        1,
        0,
        text,
        false,
        this.generalService.getUser(),
        rcv
      );
      this.generalService.sendMessage2(newMsge, type);
    } else {
      throw new Error('Reciever or sender or text or type was empty');
    }
  }

  sendWebrtcrequest(type, obj, rcv) {
    let text = JSON.stringify({
      event: type,
      reciever: this.generalService.getUser(), //after reciver recieved the message, can use this property to send it back to its sender, in that case he is a reciever
      data: obj,
    });

    let newMsge = new chatResponse(
      -1111,
      '00.00',
      1,
      0,
      text,
      false,
      this.generalService.getUser(),
      rcv
    );

    this.sendMessage(newMsge, type);
  }

  createsignalcon(rcv) {
    this.peerConnection = new RTCPeerConnection(this.configuration);
    this.dataChannel = this.peerConnection.createDataChannel('dataChannel');

    this.peerConnection.onicecandidate = ({ candidate }) => {
      //debugger;
      this.sendWebrtcrequest('candidate', candidate, rcv);
    };

    this.peerConnection.onnegotiationneeded = async () => {
      try {
        await this.peerConnection.setLocalDescription(
          await this.peerConnection.createOffer()
        );

        this.sendWebrtcrequest(
          'offer',
          this.peerConnection.localDescription,
          rcv
        );
      } catch (err) {
        console.error(err);
      }
    };

    this.peerConnection.onconnectionstatechange = (event) => {
      //debugger;
      switch (this.peerConnection.connectionState) {
        case 'new':
          this.state = 1;
        case 'connecting':
          this.state = 2;
          console.log('Connecting…');
          break;
        case 'connected':
          this.state = 3;
          console.log('Online');

          break;
        case 'disconnected':
          //debugger;
          this.state = 4;
          console.log('Disconnecting…');
          this.generalService.loading_notification_short_hoover(
            'Disconnecting…'
          );
          this.drop_call('me');
          break;
        case 'closed':
          //debugger;
          this.state = 5;
          console.log('Offline');
          this.generalService.loading_notification_short_hoover('closing…');
          this.drop_call('me');
          break;
        case 'failed':
          //debugger;
          this.state = 6;
          console.log('Error');
          this.generalService.loading_notification_short_hoover('Failling...');
          this.drop_call('me');
          break;
        default:
          //debugger;
          this.state = 7;
          console.log('Unknown');
          this.generalService.loading_notification_short_hoover(
            'Unknown Error...'
          );
          this.drop_call('me');
          break;
      }
    };

    this.peerConnection.ontrack = (event) => {
      //debugger;
      if (this.remoteView.nativeElement.srcObject) return;
      this.remoteView.nativeElement.srcObject = event.streams[0];
    };

    /* this.peerConnection.ondatachannel = (event) => {
      //debugger;
      this.dataChannel = event.channel;
      this.dataChannel.onmessage = (event) => {
        console.log('##############################################');
        console.log('Message:', event.data);
        console.log('##############################################');
      };
      this.dataChannel.onerror = (error) => {
        console.log('Error:', error);
      };
      this.dataChannel.onclose = () => {
        console.log('Data channel is closed');
        document.getElementById('calldisp').remove();
        this.store.dispatch(action.updateCallend({ callend: 1 })); //to end the call
        this.store.dispatch(action.updateCallend({ callend: 0 })); //to reset the value for next call
      };
      this.dataChannel.onopen = (event) => {
        this.dataChannel.send('successfully working data chanel');
      };
    }; */
  }

  async handelOffer(strobj) {
    let t = JSON.parse(strobj);
    //debugger;
    await this.peerConnection.setRemoteDescription(t.data);

    await this.peerConnection.setLocalDescription(
      await this.peerConnection.createAnswer()
    );
    this.sendWebrtcrequest(
      'answer',
      this.peerConnection.localDescription,
      t.reciever
    );
  }

  async handelCandidate(strobj) {
    //debugger;
    let ca = JSON.parse(strobj);
    await this.peerConnection.addIceCandidate(ca.t);
  }

  async handelAnswer(strobj) {
    //debugger;
    let t = JSON.parse(strobj);
    await this.peerConnection.setRemoteDescription(t.data);
  }

  terminateWebrtcCon() {
    //this.dataChannel.close();
    try {
      this.peerConnection.close();
    } catch (error) {
      console.log(error);
    }
  }

  terminateSoketCon() {
    try {
      if (this.client != null) {
        this.client.disconnect(function (frame) {
          console.log('Wrtweb STOMP client succesfully disconnected.');
          if (this.webSoket != null) {
            this.webSoket.close();
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  switchtofocus(vel1) {
    if (this.temp != null) {
      this.temp.setAttribute(
        'style',
        'width: 20vh;height: 20vh; background: black;'
      );
    }
    /*
    position: absolute;
    top: 0;
    width: 100vw;
    height: 76vh;*/
    vel1.setAttribute(
      'style',
      'position:absolute;top: 0;left:0;width: 100vw;height: 76vh;'
    );
    this.temp = vel1;
  }

  async start() {
    var constraints = {
      audio: true,
      video: {
        frameRate: {
          ideal: 10,
          max: 15,
        },
        width: 1280,
        height: 720,
        facingMode: 'user',
      },
    };
    try {
      // Get local stream, show it in self-view, and add it to be sent.
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);

      this.stream
        .getTracks()
        .forEach((track) => this.peerConnection.addTrack(track, this.stream));
      this.selfView.nativeElement.srcObject = this.stream;
      /*this.switchtofocus(
        this.selfView.nativeElement,
        this.mainfView.nativeElement
      );*/
    } catch (err) {
      console.error(err);
    }
  }

  loaddataforcall() {
    var constraints = {
      video: {
        frameRate: {
          ideal: 10,
          max: 15,
        },
        width: 1280,
        height: 1280,
        facingMode: 'user',
      },
    };
    window.navigator.mediaDevices.getUserMedia(constraints).then(
      (s) => {
        console.log('stream is found');
        console.log(s);
        for (const track of s.getTracks()) {
          this.peerConnection.addTrack(track, s);
        }
      },
      (f) => {
        console.log('stream is not found');
        console.log(f);
        this.generalService.loading_notification_short_hoover(
          'Device is not compitable'
        );
        this.terminateWebrtcCon();
      }
    );
  }

  getWebsoketUrl() {
    return this.wsendpoint + '/call';
  }

  handelWebrtcMessage(data: actionEvent) {
    //if (true) {
    switch (data.type) {
      case 'answer':
        if (data.from != this.generalService.getUser()) {
          this.store.dispatch(
            action.updateAns({
              ans: data.msgr.text,
            })
          );
        }
        break;
      case 'offer':
        if (data.from != this.generalService.getUser()) {
          console.log('in recieveing offer ');
          this.store.dispatch(
            action.updateOffer({
              offer: data.msgr.text,
            })
          );
        }
        break;
      case 'candidate':
        if (data.from != this.generalService.getUser()) {
          this.store.dispatch(
            action.updateCand({
              cand: data.msgr.text,
            })
          );
        }
        break;
      default:
        break;
    }
    // } else {
    //   console.log('########################################################');
    //   console.log('################### Webrtc Connection is stable ########');
    //   console.log('########################################################');
    // }
  }

  sendMessage(d, type: string) {
    //console.log(new Date().getTime().toString());
    let url = '/webrtc/call';

    if (this.client != null) {
      let data = new actionEvent(
        new Date().getUTCDate().toString(),
        1,
        type,
        this.generalService.getUser(),
        d.reciever,
        d
      );

      this.client.send(
        //'/app/broadcast',
        //`${url}/${to}`,
        url,
        { Authorization: this.generalService.getBearerToken() },
        JSON.stringify(data)
      );
    }
  }

  connect(d) {
    return new Promise((resolve, reject) => {
      if (d != '') {
        console.log('websoket connect try no :' + this.connectTryNo);
        this.webSoket = new WebSocket(this.getWebsoketUrl());
        this.client = Stomp.over(this.webSoket); //todo
        this.client.connect(
          {
            Authorization: this.generalService.getBearerToken(),
            username: this.generalService.getUser(),
          },
          (suc) => {
            resolve(true);
            reject(false);

            this.subscriptionList.push(
              this.client.subscribe(this.topic_single, (msg) => {
                this.handelWebrtcMessage(JSON.parse(msg.body));
              })
            );
            console.log('################### websoket is prepared');
            this.createsignalcon(d);
          },
          (err) => {
            resolve(false);
            reject(true);
            console.log(err);
            if (this.connectTryNo < 30) {
              if (this.talker != '') {
                this.connect(d).then((suc) => {
                  if (suc) {
                    this.connectTryNo = 0;
                    this.loadingCtrl.dismiss().then(
                      (s) => {
                        console.log(s);
                      },
                      (f) => {
                        console.log(f);
                      }
                    );
                  } else {
                    this.connectTryNo++;
                  }
                });
              }
            } else {
              console.log('App lost backend Connection');
            }
          }
        );
      } else {
        console.log('######################### there is no one to call');
      }
    });
  }
}
