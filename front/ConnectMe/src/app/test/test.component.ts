import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
import { rtcdata } from '../DTO/rtcdata';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() talker: string;
  @Input() other: string = '';
  @Output() onEndCall = new EventEmitter<any>();
  firsttime = true;
  state = -1;
  offer: rtcdata;
  offer$: Observable<rtcdata>;
  answer: rtcdata;
  answer$: Observable<rtcdata>;
  candidate: rtcdata;
  candidate$: Observable<rtcdata>;

  offer2: rtcdata;
  offer2$: Observable<rtcdata>;
  answer2: rtcdata;
  answer2$: Observable<rtcdata>;
  candidate2: rtcdata;
  candidate2$: Observable<rtcdata>;

  reciever: string = null;
  reciever$: Observable<string>;
  currentUser: string = '';
  currentUser$: Observable<string>;

  requesttomute: string = '';
  requesttomute$: Observable<string>;
  pausevideo: string = '';
  pausevideo$: Observable<string>;

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
  aud_src = 'assets/sound/waiting.m4a';
  configuration: RTCConfiguration = {
    iceServers: [
      {
        urls: 'stun:stun2.1.google.com:19302',
      },
    ],
  };
  dataChannel: RTCDataChannel;
  peerConnections: Map<string, RTCPeerConnection> = new Map();
  video_sender: RTCRtpSender;
  audio_sender: RTCRtpSender;

  remote_voice_on = false;

  AUDIO_PEERCON = 'audio_pc';
  VIDEO_PEERCON = 'video_pc';
  viddata: HTMLVideoElement;
  @ViewChild('disp1', { read: ElementRef }) selfView: ElementRef;
  @ViewChild('disp2', { read: ElementRef }) remoteView: ElementRef;
  @ViewChild('aud1', { read: ElementRef }) selfAud: ElementRef;
  @ViewChild('aud2', { read: ElementRef }) remoteAud: ElementRef;
  @ViewChild('audiostartbtnn', { read: ElementRef }) audiostartbtnn: ElementRef;
  stream_aud: MediaStream;
  stream_vid: MediaStream;
  temp = null;

  // talker$: Observable<string>;
  switch = true;
  videoConstrains_front = {
    video: {
      frameRate: {
        ideal: 10,
        max: 15,
      },
      width: 720,
      height: 1280,
      facingMode: 'user',
    },
  };
  videoConstrains_back = {
    video: {
      frameRate: {
        ideal: 10,
        max: 15,
      },
      width: 1280,
      height: 720,
      facingMode: 'environment',
    },
  };
  audioConstrains = {
    audio: true,
  };
  mute = false;
  off_video = true;
  audio_started_already = false;
  video_started_already = false;
  mute_other = false;
  off_video_other = true;
  more_camera = true;

  vid_stop = false;
  vid_resume = false;
  vid_start = false;
  aud_start = false;
  aud_stop = false;
  aud_resume = false;

  constate = '';

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
    this.requesttomute$ = this.store.select(selector.selectrequesttomute);
    this.pausevideo$ = this.store.select(selector.selectpausevideo);

    this.offer2$ = this.store.select(selector.selectOffer2);
    this.answer2$ = this.store.select(selector.selectAns2);
    this.candidate2$ = this.store.select(selector.selectCand2);

    this.callend$ = this.store.select(selector.selectCallend);
    this.peercon$ = this.store.select(selector.selectPc);
    // this.talker$ = this.store.select(selector.selectgotocallwith);
  }
  ngOnDestroy(): void {
    console.log(
      '##############||||#############destroying----- webrtc call component...##########||||###########'
    );
    this.drop_call('others', '1');
  }
  ngAfterViewInit(): void {
    //this.start_audio_first_time();
    setTimeout(() => {
      this.audiostartbtnn.nativeElement.click();
    }, 2000);
  }
  start_audio_first_time() {
    setTimeout(() => {
      if (
        this.peerConnections.get(this.AUDIO_PEERCON).signalingState ==
          'stable' &&
        this.firsttime
      ) {
        this.start_audio().then(
          (suc) => {
            console.warn(suc);
          },
          (err) => {
            console.warn(err);
          }
        );
      }

      //this.remoteView.nativeElement.click();
    }, 2000);
  }

  ngOnInit() {
    console.log('###################################################');
    console.log('################## In Call    #####################');
    console.log(this.talker);
    this.createWebrtcPeerConnection(this.talker);
    console.log('###################################################');
    this.subscreibcurrentuser();
    this.subscreibtoreciever();
    this.subscreib_current_user_image();
    this.subscreib_reciever_image();
    this.subscreib_offer();
    this.subscreib_offer2();
    this.subscreib_ans();
    this.subscreib_ans2();
    this.subscreib_cand();
    this.subscreib_cand2();
    //this.subscreib_talker();
    this.subscreib_requesttomute();
    this.subscreib_pausevideo();
  }
  createWebrtcPeerConnection(d) {
    this.createsignalcon(d, this.AUDIO_PEERCON);
    this.createsignalcon(d, this.VIDEO_PEERCON);
    setTimeout(async () => {
      //await this.start_audio();
      //this.remoteView.nativeElement.click();
    }, 2000);
  }
  subscreib_requesttomute() {
    this.subscriptionList.push(
      this.requesttomute$.subscribe((d) => {
        if (d != '') {
          this.requesttomute = d;
          this.request_to_resume_video(d);
          this.store.dispatch(action.updatepausevideo({ pausevideo: 'show' }));
        }
      })
    );
  }
  subscreib_pausevideo() {
    this.subscriptionList.push(
      this.pausevideo$.subscribe((d) => {
        if (d != '') {
          this.pausevideo = d;
          if (d == 'show') {
            this.remoteView.nativeElement.setAttribute(
              'style',
              'display:block'
            );
          }
          if (d == 'hide') {
            this.remoteView.nativeElement.setAttribute('style', 'display:none');
          }
          this.store.dispatch(action.updatepausevideo({ pausevideo: '' }));
        }
      })
    );
  }
  subscreib_reciever_image() {
    this.subscriptionList.push(
      this.rimage$.subscribe((d) => {
        this.rimage = d;
      })
    );
  }

  /*  subscreib_talker() {
    this.subscriptionList.push(
      this.talker$.subscribe((d) => {
        if (d == this.generalService.call_cancelled_other) {
          d = '';
          this.drop_call('other', '1');
          this.store.dispatch(action.updategotocallwith({ gotocallwith: '' }));
        }
      })
    );
  } */

  /* subscreib_router() {
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
  } */

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

  subscreib_offer() {
    this.subscriptionList.push(
      this.offer$.subscribe((strobj) => {
        this.offer = strobj;
        if (strobj != null) {
          this.handelOffer(strobj, this.AUDIO_PEERCON);
        }
      })
    );
  }
  subscreib_offer2() {
    this.subscriptionList.push(
      this.offer2$.subscribe((strobj) => {
        this.offer2 = strobj;
        if (strobj != null) {
          //debugger;
          console.log('video offer recieved');
          this.handelOffer(strobj, this.VIDEO_PEERCON);
        }
      })
    );
  }
  subscreib_ans() {
    this.subscriptionList.push(
      this.answer$.subscribe((strobj) => {
        this.answer = strobj;
        if (strobj != null) {
          // debugger;
          this.handelAnswer(strobj, this.AUDIO_PEERCON);
        }
      })
    );
  }
  subscreib_ans2() {
    this.subscriptionList.push(
      this.answer2$.subscribe((strobj) => {
        this.answer2 = strobj;
        if (strobj != null) {
          // debugger;
          this.handelAnswer(strobj, this.VIDEO_PEERCON);
        }
      })
    );
  }

  subscreib_cand() {
    this.subscriptionList.push(
      this.candidate$.subscribe((strobj) => {
        this.candidate = strobj;
        if (strobj != null) {
          //debugger;
          this.handelCandidate(strobj, this.AUDIO_PEERCON);
        }
      })
    );
  }
  subscreib_cand2() {
    this.subscriptionList.push(
      this.candidate2$.subscribe((strobj) => {
        this.candidate2 = strobj;
        if (strobj != null) {
          // debugger;
          this.handelCandidate(strobj, this.VIDEO_PEERCON);
        }
      })
    );
  }

  drop_call(mode, origin) {
    try {
      this.terminateWebrtcCon(this.AUDIO_PEERCON);
      this.terminateWebrtcCon(this.VIDEO_PEERCON);
      setTimeout(() => {
        try {
          if (this.stream_aud != null) {
            if (this.stream_aud.getAudioTracks().length > 0) {
              this.stream_aud.getAudioTracks().forEach((t) => {
                t.enabled = false;
                t.stop();
              });
            }
            if (this.stream_aud.getTracks().length > 0) {
              this.stream_aud.getTracks().forEach((t) => {
                t.enabled = false;
                t.stop();
              });
            }
            if (
              this.stream_aud.onaddtrack != null &&
              this.stream_aud.onaddtrack != undefined
            ) {
              this.stream_aud.onaddtrack = null;
            }
            if (
              this.stream_aud.onremovetrack != null &&
              this.stream_aud.onremovetrack != undefined
            ) {
              this.stream_aud.onremovetrack = null;
            }
          }
          this.stream_aud = null;

          if (this.stream_vid != null) {
            if (this.stream_vid.getVideoTracks().length > 0) {
              this.stream_vid.getVideoTracks().forEach((t) => {
                t.enabled = false;
                t.stop();
              });
            }
            if (this.stream_vid.getTracks().length > 0) {
              this.stream_vid.getTracks().forEach((t) => {
                t.enabled = false;
                t.stop();
              });
            }
            if (
              this.stream_vid.onaddtrack != null &&
              this.stream_vid.onaddtrack != undefined
            ) {
              this.stream_vid.onaddtrack = null;
            }
            if (
              this.stream_vid.onremovetrack != null &&
              this.stream_vid.onremovetrack != undefined
            ) {
              this.stream_vid.onremovetrack = null;
            }
          }
          this.stream_vid = null;

          if (this.remoteAud != null && this.remoteAud != undefined) {
            if (
              this.remoteAud.nativeElement != null &&
              this.remoteAud.nativeElement != undefined
            ) {
              if (
                this.remoteAud.nativeElement.srcObject != null &&
                this.remoteAud.nativeElement.srcObject != undefined
              ) {
                this.remoteAud.nativeElement.srcObject
                  .getTracks()
                  .forEach((track) => {
                    track.enabled = false;
                    track.stop();
                  });
                this.remoteAud.nativeElement.srcObject = null;
              }
              this.remoteAud.nativeElement.remove();
            }
            this.remoteAud = null;
          }

          if (this.remoteView != null && this.remoteView != undefined) {
            if (
              this.remoteView.nativeElement != null &&
              this.remoteView.nativeElement != undefined
            ) {
              if (
                this.remoteView.nativeElement.srcObject != null &&
                this.remoteView.nativeElement.srcObject != undefined
              ) {
                this.remoteView.nativeElement.srcObject
                  .getTracks()
                  .forEach((track) => {
                    track.enabled = false;
                    track.stop();
                  });
                this.remoteView.nativeElement.srcObject = null;
              }
              this.remoteView.nativeElement.remove();
            }
            this.remoteView = null;
          }

          this.offer = null;
          this.store.dispatch(action.updateOffer({ offer: this.offer }));
          this.offer2 = null;
          this.store.dispatch(action.updateOffer2({ offer2: this.offer2 }));
          this.answer = null;
          this.store.dispatch(action.updateAns({ ans: this.answer }));
          this.answer2 = null;
          this.store.dispatch(action.updateAns2({ ans2: this.answer2 }));
          this.candidate = null;
          this.store.dispatch(action.updateCand({ cand: this.candidate }));
          this.candidate2 = null;
          this.store.dispatch(action.updateCand2({ cand2: this.candidate2 }));
          setTimeout(() => {
            this.unsub_subs();
            setTimeout(() => {
              if (mode == 'other') {
                this.onEndCall.emit('1');
              }
              if (mode == 'me') {
                this.store.dispatch(
                  action.updateCall({
                    call:
                      this.generalService.call_cancelled_me +
                      this.generalService.separator +
                      this.talker,
                  })
                );
              }

              this.talker = '';
            }, 100);
          }, 100);
        } catch (error) {
          console.log(error);
        }
      }, 100);
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

  back() {
    //this.drop_call('me', '2');
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
    let d = new rtcdata(
      JSON.stringify(obj),
      type,
      this.generalService.getUser(),
      rcv
    );

    this.sendMessage(d);
  }
  createsignalcon(rcv, type) {
    this.create_Peerconnection(rcv, this.peerConnections, type);
  }

  create_Peerconnection(rcv: string, pc: Map<string, RTCPeerConnection>, type) {
    console.warn('creating ' + type + ' peer connection');
    try {
      let peerConnection = new RTCPeerConnection(this.configuration);
      //  let peerConnection = new RTCPeerConnection();
      // this.dataChannel = this.peerConnection.createDataChannel('dataChannel');
      console.warn('new peer connection has been created');
      let pt = peerConnection;
      console.log(pt);
      console.warn('event handler are being added');
      peerConnection.oniceconnectionstatechange = (event) => {
        this.constate = peerConnection.iceConnectionState;

        try {
          if (peerConnection.iceConnectionState == 'failed') {
            if (this.talker != '') {
              peerConnection.restartIce();

              this.generalService.loading_notification_short_hoover(
                'Connecting..'
              );
              console.log('ICE agent got stuck in checking state');
            }
          }
        } catch (error) {
          console.log(error);
        }
      };

      if (type == this.AUDIO_PEERCON) {
        /* peerConnection.onsignalingstatechange = (event) => {
          if (peerConnection.signalingState == 'stable' && this.firsttime) {
            this.firsttime = false;
            this.start_audio();
          }
        }; */
        peerConnection.onicecandidate = (event) => {
          try {
            this.sendWebrtcrequest('candidate', event.candidate, rcv);
          } catch (error) {
            console.log(error);
          }
        };
        peerConnection.onnegotiationneeded = async () => {
          this.settimerTocutthecallunlessconectionisstable(peerConnection);
          try {
            await peerConnection.setLocalDescription(
              await peerConnection.createOffer()
            );

            this.sendWebrtcrequest(
              'offer',
              peerConnection.localDescription,
              rcv
            );
          } catch (err) {
            console.log(err);
            this.generalService.loading_notification_short_hoover(
              'Errror while making connect..'
            );
          }
        };

        peerConnection.ontrack = (event) => {
          try {
            if (this.remoteAud.nativeElement.srcObject) return;
            this.remoteAud.nativeElement.srcObject = event.streams[0];
            this.remoteAud.nativeElement.play();
            this.remote_voice_on = true;
          } catch (error) {
            console.log(error);
            this.remote_voice_on = false;
          }
        };

        pc.set(this.AUDIO_PEERCON, peerConnection);
      }
      if (type == this.VIDEO_PEERCON) {
        peerConnection.onicecandidate = (event) => {
          try {
            this.sendWebrtcrequest('candidate2', event.candidate, rcv);
          } catch (error) {
            console.log(error);
          }
        };
        peerConnection.onnegotiationneeded = async () => {
          try {
            await peerConnection.setLocalDescription(
              await peerConnection.createOffer()
            );

            this.sendWebrtcrequest(
              'offer2',
              peerConnection.localDescription,
              rcv
            );
          } catch (err) {
            console.log(err);
            this.generalService.loading_notification_short_hoover(
              'Errror while making connect..'
            );
          }
        };
        peerConnection.ontrack = (event) => {
          if (!this.video_started_already) {
            this.presentActionSheet(1);
          }

          try {
            if (this.remoteView.nativeElement.srcObject) return;
            this.remoteView.nativeElement.srcObject = event.streams[0];
          } catch (error) {
            console.log(error);
          }
        };
        console.warn('peersonnection has all the event handler now');
        let pt2 = peerConnection;
        console.log(pt2);
        pc.set(this.VIDEO_PEERCON, peerConnection);
        console.log(pc);
      }
    } catch (error) {
      console.log('Peer connection type ' + type + ', was not succesfull');
      this.generalService.loading_notification_short_hoover(
        'Peer connection type ' + type + ', was not succesfull'
      );
      console.log(error);
    }
  }
  settimerTocutthecallunlessconectionisstable(p: RTCPeerConnection) {
    setTimeout(() => {
      if (p.iceConnectionState == 'checking' && this.talker != '') {
        this.peerConnections.get(this.AUDIO_PEERCON).restartIce();
      }
    }, 5000);
    setTimeout(() => {
      if (p.iceConnectionState == 'checking' && this.talker != '') {
        this.generalService.loading_notification_short_hoover('Network Error');
        this.drop_call('other', '3');
      }
    }, 60000);
  }

  async handelOffer(t: rtcdata, key) {
    try {
      console.log('handeling recieved offer ');
      console.log('settting remote discription');
      await this.peerConnections
        .get(key)
        .setRemoteDescription(JSON.parse(t.data));
      console.log('setting local description');
      await this.peerConnections
        .get(key)
        .setLocalDescription(
          await this.peerConnections.get(key).createAnswer()
        );
      console.log('sending answer back for this offer');
      if (key == this.AUDIO_PEERCON) {
        this.sendWebrtcrequest(
          'answer',
          this.peerConnections.get(key).localDescription,
          t.sender
        );
      } else if (key == this.VIDEO_PEERCON) {
        this.sendWebrtcrequest(
          'answer2',
          this.peerConnections.get(key).localDescription,
          t.sender
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async handelCandidate(t: rtcdata, key) {
    console.log('handeling recieved candidate');
    try {
      if (t.data != null) {
        await this.peerConnections.get(key).addIceCandidate(JSON.parse(t.data));
        console.log('candidate is added to peerconnection ');
      }
    } catch (error) {
      console.log('error happend handeling candidate');
      console.log(error);
    }
  }

  async handelAnswer(t: rtcdata, key) {
    console.log('handeling recieved answer');
    try {
      if (t.data != null) {
        await this.peerConnections
          .get(key)
          .setRemoteDescription(JSON.parse(t.data));
        console.log('answer as remote discription is added to peerconnection ');
      }
    } catch (error) {
      console.log('error happend handeling answer');
      console.log(error);
    }
  }

  terminateWebrtcCon(key) {
    //this.dataChannel.close();
    console.warn('terminating ' + key + ' peerconnection :');
    try {
      console.warn('checking if the list has the given key of peerconnection');
      if (this.peerConnections.has(key)) {
        console.warn('key was found in the list');
        console.warn('checking if it is audio or video peer');
        if (this.AUDIO_PEERCON == key) {
          console.warn('It is audio peerconnection');
          console.warn(this.audio_sender);
          if (this.audio_sender != undefined && this.audio_sender != null) {
            console.warn('removing audio sender from peerconnection');
            let plts3 = this.peerConnections.get(key);
            console.log(plts3);
            this.peerConnections.get(key).removeTrack(this.audio_sender);
            console.warn('audio sender is removed');
            let plts4 = this.peerConnections.get(key);
            console.log(plts4);
          } else {
            console.warn('audio sender is not defined or it is null');
          }
        }
        if (this.VIDEO_PEERCON == key) {
          console.warn('It is video peerconnection');
          console.warn(this.video_sender);
          if (this.video_sender != undefined && this.video_sender != null) {
            console.warn('removing video sender from peerconnection');
            let plts1 = this.peerConnections.get(key);
            console.log(plts1);
            this.peerConnections.get(key).removeTrack(this.video_sender);
            console.warn('video sender is removed');
            let plts2 = this.peerConnections.get(key);
            console.log(plts2);
          } else {
            console.warn('video sender is not defined or it is null');
          }
        }
        console.warn('setting all the event handler to null');
        this.peerConnections.get(key).ontrack = null;
        this.peerConnections.get(key).onicecandidateerror = null;
        this.peerConnections.get(key).onconnectionstatechange = null;
        this.peerConnections.get(key).onicecandidate = null;
        this.peerConnections.get(key).oniceconnectionstatechange = null;
        this.peerConnections.get(key).onsignalingstatechange = null;
        this.peerConnections.get(key).onicegatheringstatechange = null;
        this.peerConnections.get(key).onnegotiationneeded = null;
        this.peerConnections.get(key).ondatachannel = null;
        this.peerConnections.get(key).close();
        let plt2 = this.peerConnections;
        console.log(plt2);

        this.peerConnections.set(key, null);

        this.peerConnections.delete(key);
      } else {
        if (this.AUDIO_PEERCON == key) {
          console.warn('audio peer connection is empty');
          let plt3 = this.peerConnections;
          console.log(plt3);
        }
        if (this.VIDEO_PEERCON == key) {
          console.warn('video peer connection is empty');
          let plt4 = this.peerConnections;
          console.log(plt4);
        }
      }
    } catch (error) {
      console.log(error);
      this.generalService.loading_notification_short_hoover(
        'Please Reopen the App'
      );
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

  async start_audio() {
    try {
      this.stream_aud = await navigator.mediaDevices.getUserMedia(
        this.audioConstrains
      );

      this.audio_sender = this.peerConnections
        .get(this.AUDIO_PEERCON)
        .addTrack(this.stream_aud.getTracks()[0], this.stream_aud);
      //i dont want to hear my voice
      // this.selfAud.nativeElement.srcObject = this.stream_aud;

      this.audio_started_already = true;
      this.mute = false;
      this.aud_start = false;
    } catch (err) {
      console.log(err);
      this.generalService.loading_notification_short_hoover(
        'Could not get Recorder..'
      );

      this.audio_started_already = false;
      this.mute = true;
      this.aud_start = false;
    }
  }

  async resume_audio() {
    try {
      this.mute = false;
      if (this.stream_aud.getAudioTracks().length > 0) {
        this.stream_aud.getAudioTracks().forEach((t) => {
          t.enabled = !this.mute;
        });
      }
      if (this.stream_aud.getTracks().length > 0) {
        this.stream_aud.getTracks().forEach((t) => {
          t.enabled = !this.mute;
        });
        this.aud_resume = false;
      }
      this.aud_resume = false;
    } catch (error) {
      this.generalService.loading_notification_short_hoover(
        'Could not resume Audio'
      );
      this.aud_resume = false;
    }
  }

  async stop_audio() {
    try {
      this.mute = true;
      if (this.stream_aud.getAudioTracks().length > 0) {
        this.stream_aud.getAudioTracks().forEach((t) => {
          t.enabled = !this.mute;
        });
      }
      if (this.stream_aud.getTracks().length > 0) {
        this.stream_aud.getTracks().forEach((t) => {
          t.enabled = !this.mute;
        });
      }
      this.aud_stop = false;
    } catch (error) {
      this.generalService.loading_notification_short_hoover(
        'Could not stop Audio'
      );
      this.aud_stop = false;
    }
  }
  async switch_camera() {
    let temp = this.stream_vid;
    try {
      this.switch = !this.switch;

      if (this.switch) {
        this.stream_vid = await navigator.mediaDevices.getUserMedia(
          this.videoConstrains_front
        );
      } else {
        this.stream_vid = await navigator.mediaDevices.getUserMedia(
          this.videoConstrains_back
        );
      }
      this.selfView.nativeElement.srcObject = this.stream_vid;
      this.video_sender.replaceTrack(this.stream_vid.getTracks()[0]);

      if (temp.getTracks().length > 0) {
        temp.getTracks()[0].stop();
        temp.getVideoTracks()[0].stop();
      }
    } catch (error) {
      this.generalService.loading_notification_short_hoover(
        'Can not switch Camera'
      );
      this.stream_vid = temp;
      console.log(error);
    }
  }

  async start_video() {
    try {
      this.stream_vid = await navigator.mediaDevices.getUserMedia(
        this.videoConstrains_front
      );

      this.stream_vid.getTracks().forEach((track) => {
        this.video_sender = this.peerConnections
          .get(this.VIDEO_PEERCON)
          .addTrack(track, this.stream_vid);
      });
      this.selfView.nativeElement.srcObject = this.stream_vid;

      this.video_started_already = true;
      this.off_video = false;
      this.vid_start = false;
      /*this.switchtofocus(
        this.selfView.nativeElement,
        this.mainfView.nativeElement
      );*/
    } catch (err) {
      console.log(err);
      this.generalService.loading_notification_short_hoover(
        'Could not get camera..'
      );

      this.audio_started_already = false;
      this.off_video = true;
      this.vid_start = false;
    }
  }
  request_to_resume_video(from) {
    this.store.dispatch(action.updaterequesttomute({ requesttomute: '' }));
    if (this.off_video) {
      this.presentActionSheet(2);
    } else {
      //no need
    }
  }
  async resume_video() {
    try {
      this.sendWebrtcrequest(
        'requesttomute',
        this.generalService.getUser(),
        this.talker
      );
      this.off_video = false;

      if (this.stream_vid.getVideoTracks().length > 0) {
        this.stream_vid.getVideoTracks().forEach((t) => {
          t.enabled = !this.off_video;
        });
      }
      if (this.stream_vid.getTracks().length > 0) {
        this.stream_vid.getTracks().forEach((t) => {
          t.enabled = !this.off_video;
        });
      }
      this.vid_resume = false;
    } catch (error) {
      console.log('tracks are already empty');
      this.vid_resume = false;
    }
  }
  async stop_video() {
    try {
      this.off_video = true;
      this.sendWebrtcrequest('pausevideo', 'hide', this.talker);

      if (this.stream_vid.getVideoTracks().length > 0) {
        this.stream_vid.getVideoTracks().forEach((t) => {
          t.enabled = !this.off_video;
        });
      }
      if (this.stream_vid.getTracks().length > 0) {
        this.stream_vid.getTracks().forEach((t) => {
          t.enabled = !this.off_video;
        });
      }
      this.vid_stop = false;
    } catch (error) {
      console.log('tracks are already empty');
      this.vid_stop = false;
    }
  }

  sendMessage(d: rtcdata) {
    //console.log(new Date().getTime().toString());
    let url = '/webrtc/call';

    if (this.generalService.clientWebrtc != null) {
      this.generalService.clientWebrtc.send(
        //'/app/broadcast',
        //`${url}/${to}`,
        url,
        { Authorization: this.generalService.getBearerToken() },
        JSON.stringify(d)
      );
    }
  }

  async presentActionSheet(mode) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Video Request',
      buttons: [
        {
          text: 'Accept',
          icon: 'videocam-outline',
          handler: () => {
            if (mode == 1) {
              this.start_video();
            } else if (mode == 2) {
              this.resume_video();
            }
          },
        },
        {
          text: 'Cancel',
          icon: 'videocam-off-outline',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
      backdropDismiss: false,
    });
    await actionSheet.present();
  }

  async start() {
    //this.createsignalcon(this.talker, this.AUDIO_PEERCON);
    await this.start_audio();
  }
}
