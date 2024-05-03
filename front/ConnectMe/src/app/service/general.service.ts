import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Store } from '@ngrx/store';
import jwt_decode from 'jwt-decode';
import { State } from '../store/reducer';
import * as action from '../store/action';
import * as Stomp from 'stompjs';
import { chatResponse } from '../DTO/chatResponse';
import { Observable } from 'rxjs';
import * as selector from '../store/selector';
import { actionEvent } from '../DTO/actionEvent';
import { encode } from 'querystring';
import { environment } from 'src/environments/environment.prod';
import { updateUser } from '../model/updateUser';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingController } from '@ionic/angular';
import * as Color from 'color';
import { Storage } from '@ionic/storage';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { Chathead } from '../DTO/chatHead';
import { Gifformat } from '../DTO/Gifformat';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  endpoint = environment.server; // 'http://192.168.2.133:8080';
  wsendpoint = environment.webSoket; // 'ws://192.168.2.133:8080';
  //endpoint = 'http://localhost:8080';
  //wsendpoint = 'ws://localhost:8080';
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  call_cancelled_me = 'cancel_me';
  call_cancelled_other = 'cancel_other';
  call_started_me = 'start_me';
  call_started_other = 'start_other';
  call_answered_me = 'answer_me';
  call_answered_other = 'answer_other';
  webrtc_conected_tosoket = 'webrtc_conected_tosoket';
  separator = '|-|';
  notificationDuration = 0;
  notificationDurationfix = 1000;
  jwtToken: string;
  decodedToken: { [key: string]: string };
  topic: string = '/topic/messages';
  topic_single: string = '/users/queue/reply';
  client: Stomp.Client = null;
  webSoket: WebSocket = null;

  connectTryNoWebrtc = 0;
  wsendpointWebrtc = environment.webSoket;
  topic_singleWebrtc: string = '/users/call/reply';
  clientWebrtc: Stomp.Client = null;
  webSoketWebrtc: WebSocket = null;

  msgStore = {};
  msgs: chatResponse[] = [];
  msgs$: Observable<chatResponse[]>;
  reciever: string = null;
  reciever$: Observable<string>;
  subscriptions = [];
  connectTryNo = 0;
  currentchatid = 'currentchatid';
  currentrecieverlocal = 'currentrecieverlocal';
  waiting_time = 1000 * 2000;

  constructor(
    private httpClient: HttpClient,
    private store: Store<State>,
    public loadingCtrl: LoadingController,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document,
    private storage: Storage
  ) {
    this.msgs$ = this.store.select(selector.selectViewMessage);

    this.msgs$.subscribe((m) => {
      if (m != undefined && m != null && m.length > 0) {
        this.msgs = m;
      } else {
        //loadMsgFromBack();
      }
    });

    this.reciever$ = this.store.select(selector.selectCurrentReciever);
    this.reciever$.subscribe((rsvr) => {
      this.reciever = rsvr;
    });
  }
  register(data) {
    return this.httpClient.post<any>(
      this.endpoint + '/user/register/',
      JSON.stringify(data),
      this.httpHeader
    );
  }

  createChat(user) {
    return this.httpClient.post<any>(
      this.endpoint + '/chat/create/',
      [this.getUser(), user],
      this.httpHeader
    );
  }

  update(data) {
    return this.httpClient.post<any>(
      this.endpoint + '/user/update/',
      JSON.stringify(data),
      this.httpHeader
    );
  }
  updateSingleProfileEntry(data) {
    return this.httpClient.post<any>(
      this.endpoint + '/user/profile/update/single',
      JSON.stringify(data),
      this.httpHeader
    );
  }
  updateSingleUserEntry(data) {
    return this.httpClient.post<any>(
      this.endpoint + '/user/update/single',
      JSON.stringify(data),
      this.httpHeader
    );
  }
  login(data) {
    return this.httpClient.post<any>(
      this.endpoint + '/user/login',
      JSON.stringify(data),
      this.httpHeader
    );
  }
  getMesssages(user: string): Observable<chatResponse[]> {
    return this.httpClient.post<any>(
      this.endpoint + '/message/all',
      user,
      this.httpHeader
    );
  }
  getMesssagesbyUser(user: string): Observable<chatResponse[]> {
    return this.httpClient.post<any>(
      this.endpoint + '/message/user',
      [this.getUser(), user],
      this.httpHeader
    );
  }

  getMesssagesohneLimit(id: string): Observable<chatResponse[]> {
    return this.httpClient.post<any>(
      this.endpoint + '/message/till/id',
      [this.getUser(), id],
      this.httpHeader
    );
  }

  getMesssagebyId(id: string): Observable<chatResponse> {
    return this.httpClient.post<any>(
      this.endpoint + '/message/id',
      [id],
      this.httpHeader
    );
  }

  getGifs(key: string): Observable<Gifformat[]> {
    console.log(key);
    let p = this.httpClient.post<any>(
      this.endpoint + '/message/gif',
      [key],
      this.httpHeader
    );
    console.log(p);
    return p;
  }

  getChatHeadinfo(user: string): Observable<Chathead[]> {
    return this.httpClient.post<any>(
      this.endpoint + '/chat/chathead/user',
      [this.getUser(), user],
      this.httpHeader
    );
  }

  getChatHeadinfobychatid(
    id: string,
    limit: number,
    timemili: number,
    offset: number
  ): Observable<Chathead> {
    return this.httpClient.post<any>(
      this.endpoint + '/chat/chathead',
      [id, this.getUser(), limit, timemili, offset],
      this.httpHeader
    );
  }

  getChatIdoftwousers(user: string): Observable<string> {
    return this.httpClient.post<any>(
      this.endpoint + '/chat/findchatidoftwouser',
      [this.getUser(), user],
      this.httpHeader
    );
  }

  searchUserByName(key: string): Observable<string[]> {
    return this.httpClient.post<any>(
      this.endpoint + '/user/search',
      key,
      this.httpHeader
    );
  }

  getUserSpokenTo(key: string) {
    return this.httpClient.post<any>(
      this.endpoint + '/user/spokenTo',
      key,
      this.httpHeader
    );
  }

  sendFileWithoutWebSocket(file: FormData) {
    return this.httpClient.post<any>(
      this.endpoint + '/message/uploadFile',
      file,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );
  }

  getUserbyName(key: string): Observable<updateUser> {
    return this.httpClient.post<any>(
      this.endpoint + '/user/get',
      key,
      this.httpHeader
    );
  }

  getUserPhoto(key: string): Observable<string[]> {
    return this.httpClient.post<any>(
      this.endpoint + '/user/photo',
      key,
      this.httpHeader
    );
  }

  getProfileByUserId(key: string) {
    return this.httpClient.post<any>(
      this.endpoint + '/user/profile',
      key,
      this.httpHeader
    );
  }

  /* updateallMsgSeenOfaUser(chatid: string) {
    //const params = new HttpParams().set('id', id).set('ans', ans);
    console.log('msg seen rqst sent to backend');
    return this.httpClient.post<any>(
      this.endpoint + '/message/all/messageSeen/user',
      [chatid, this.getUser()],
      this.httpHeader
    );
  } */

  /* uploadDataToServerAsBlob(file: Blob, filename: string) {
    //const params = new HttpParams().set('id', id).set('ans', ans);
    const formdata: FormData = new FormData();
    formdata.append('file',file,filename);
    console.log('msg seen rqst sent to backend');
    return this.httpClient.post<any>(
      this.endpoint + '/message/messageSeen',
      formdata,
      this.httpHeader
    );
  } */

  showBusy() {
    let p = document.createElement('div');
    p.setAttribute('id', 'busyid');
    p.setAttribute(
      'style',
      'position:absolute;width:100%;height:100%;background-color:#ffffff7a;'
    );
    document.body.appendChild(p);
  }
  endBusy() {
    document.getElementById('busyid').remove();
  }
  prepareSession(token) {
    let ans: boolean = false;

    ans = this.setToken(token);

    if (ans) {
      let currentUser = this.getUser();
      localStorage.setItem('currentUser', currentUser);
      console.log('in  g service');
      console.log(currentUser);
      this.store.dispatch(action.updateurrentUser({ currentUser }));
    }

    return ans;
  }
  destroySession() {
    localStorage.removeItem('token');
    let currentUser = '';
    this.store.dispatch(action.updateCurrentReciever({ currentReciever: '' }));
    this.store.dispatch(action.updateurrentUser({ currentUser }));
    this.store.dispatch(action.updateViewdMessage({ msgs: [] }));
    this.store.dispatch(action.updateUserImage({ image: '' }));
    localStorage.removeItem('currentUser');
    localStorage.removeItem('friends');
    localStorage.removeItem(this.currentrecieverlocal);
    localStorage.removeItem(this.currentchatid);
  }
  setToken(token: string): boolean {
    if (token) {
      localStorage.setItem('token', token);
      return true;
    } else {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }
  getBearerToken() {
    return 'Bearer ' + localStorage.getItem('token');
  }

  getDecodeToken() {
    let ans = null;
    if (localStorage.getItem('token')) {
      ans = jwt_decode(localStorage.getItem('token'));
    } else {
      ans = null;
    }
    return ans;
  }

  getUser() {
    this.decodedToken = this.getDecodeToken();
    return this.decodedToken ? this.decodedToken.name : null;
  }

  getEmailId() {
    this.decodedToken = this.getDecodeToken();
    return this.decodedToken ? this.decodedToken.email : null;
  }

  getExpiryTime() {
    this.decodedToken = this.getDecodeToken();
    return this.decodedToken ? this.decodedToken.exp : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: number = parseInt(this.getExpiryTime());
    if (expiryTime) {
      return 1000 * expiryTime - new Date().getTime() < 5000;
    } else {
      return true;
    }
  }

  getWebsoketUrl() {
    return this.wsendpoint + '/ws';
  }
  getWebsoketUrlWebrtc() {
    return this.wsendpointWebrtc + '/call';
  }
  getWebsoket() {
    return new WebSocket(this.getWebsoketUrl());
  }
  sendMessage(msg) {
    //console.log(new Date().getTime().toString());
    let url = '/app/message';

    try {
      let to = msg.reciever;
      if (this.client != null && msg.reciever != '' && this.getUser() != '') {
        let data = new actionEvent(
          new Date().getUTCDate().toString(),
          -111,
          'message',
          this.getUser(),
          msg.reciever,
          msg
        );

        this.client.send(
          //'/app/broadcast',
          //`${url}/${to}`,
          url,
          { Authorization: this.getBearerToken() },
          JSON.stringify(data)
        );
      } else {
        throw new Error('soket cleint or reciever or sender may be empty');
      }
    } catch (error) {
      console.log(
        '#################### error while sending message ################### '
      );
      console.log(error);
    }
  }

  sendMessage2(d, type: string) {
    //console.log(new Date().getTime().toString());
    let url = '/app/message';

    try {
      if (this.client != null && d.reciever != '' && this.getUser() != '') {
        let data = new actionEvent(
          new Date().getUTCDate().toString(),
          1,
          type,
          this.getUser(),
          d.reciever,
          d
        );

        this.client.send(
          //'/app/broadcast',
          //`${url}/${to}`,
          url,
          { Authorization: this.getBearerToken() },
          JSON.stringify(data)
        );
      } else {
        throw new Error('soket cleint or reciever or sender may be empty');
      }
    } catch (error) {
      console.log(
        '#################### error while sending message ################### '
      );
      console.log(error);
    }
  }

  sendMessageAll(msg) {
    //console.log(new Date().getTime().toString());
    let url = '/app/message';
    let to = msg.to;
    try {
      if (this.client != null) {
        let data = new actionEvent(
          new Date().getUTCDate().toString(),
          1,
          'message',
          this.getUser(),
          msg.reciever,
          msg
        );

        this.client.send(
          '/app/broadcast',
          { Authorization: this.getBearerToken() },
          JSON.stringify(data)
        );
      } else {
        throw new Error('soket cleint or reciever or sender may be empty');
      }
    } catch (error) {
      console.log(
        '#################### error while sending message ################### '
      );
      console.log(error);
    }
  }

  get_locations() {
    if (this.client != null) {
      let data = new actionEvent(
        new Date().getUTCDate().toString(),
        1,
        'location',
        this.getUser(),
        '',
        new chatResponse(-1, '', 1, 0, '', true, '', '')
      );

      this.client.send(
        '/app/broadcast',
        { Authorization: this.getBearerToken() },
        JSON.stringify(data)
      );
    }
  }

  share_locations(loc: string, share: string) {
    if (this.client != null) {
      let data = new actionEvent(
        new Date().getUTCDate().toString(),
        1,
        'location_share',
        this.getUser(),
        share,
        new chatResponse(-1, '', 1, 0, loc, true, '', '')
      );
      this.client.send(
        '/app/broadcast',
        { Authorization: this.getBearerToken() },
        JSON.stringify(data)
      );
    }
  }
  //############################# webrtc start ###########################################
  connectWebrtc() {
    return new Promise((resolve, reject) => {
      console.log('websoket connect try no :' + this.connectTryNo);
      this.webSoketWebrtc = new WebSocket(this.getWebsoketUrl());
      this.clientWebrtc = Stomp.over(this.webSoketWebrtc); //todo
      this.clientWebrtc.connect(
        {
          Authorization: this.getBearerToken(),
          username: this.getUser(),
        },
        (suc) => {
          resolve(true);
          reject(false);

          this.subscriptions.push(
            this.clientWebrtc.subscribe(this.topic_singleWebrtc, (msg) => {
              this.handelWebrtcMessage(JSON.parse(msg.body));
            })
          );
        },
        (err) => {
          console.log(err);
          if (this.connectTryNoWebrtc < 30) {
            this.connectWebrtc().then((suc) => {
              if (suc) {
                this.connectTryNoWebrtc = 0;
                this.loadingCtrl.dismiss().then(
                  (s) => {
                    console.log(s);
                  },
                  (f) => {
                    console.log(f);
                  }
                );
              } else {
                this.connectTryNoWebrtc++;
              }
            });
          } else {
            resolve(false);
            reject(true);
            console.log('App lost Webrtc backend Connection');
          }
        }
      );
    });
  }
  handelWebrtcMessage(data) {
    //if (true) {

    switch (data.type) {
      case 'answer':
        if (data.sender != this.getUser()) {
          this.store.dispatch(
            action.updateAns({
              ans: data,
            })
          );
        }
        break;
      case 'offer':
        if (data.sender != this.getUser()) {
          this.store.dispatch(
            action.updateOffer({
              offer: data,
            })
          );
        }
        break;
      case 'candidate':
        if (data.sender != this.getUser()) {
          this.store.dispatch(
            action.updateCand({
              cand: data,
            })
          );
        }
        break;
      case 'answer2':
        if (data.sender != this.getUser()) {
          this.store.dispatch(
            action.updateAns2({
              ans2: data,
            })
          );
        }
        break;
      case 'offer2':
        if (data.sender != this.getUser()) {
          console.log('in recieveing offer ');
          this.store.dispatch(
            action.updateOffer2({
              offer2: data,
            })
          );
        }
        break;
      case 'candidate2':
        if (data.sender != this.getUser()) {
          this.store.dispatch(
            action.updateCand2({
              cand2: data,
            })
          );
        }
        break;
      case 'requesttomute':
        if (data.sender != this.getUser()) {
          let t: string = JSON.parse(data).data;
          this.store.dispatch(
            action.updaterequesttomute({
              requesttomute: t,
            })
          );
        }
        break;
      case 'pausevideo':
        if (data.sender != this.getUser()) {
          let t: string = JSON.parse(data).data;
          this.store.dispatch(
            action.updatepausevideo({
              pausevideo: t,
            })
          );
        }
        break;
      default:
        break;
    }
  }
  //################################### web rtc end ############################################

  connect() {
    return new Promise((resolve, reject) => {
      console.log('websoket connect try no :' + this.connectTryNo);
      this.webSoket = new WebSocket(this.getWebsoketUrlWebrtc());
      this.client = Stomp.over(this.webSoket);
      this.client.connect(
        { Authorization: this.getBearerToken(), username: this.getUser() },
        (suc) => {
          this.createStorage();
          resolve(true);
          reject(false);
          console.log(suc);
          console.log(this.client);
          this.subscriptions.push(
            this.client.subscribe(this.topic, (msg) => {
              this.handelMessage(JSON.parse(msg.body));
            })
          );
          this.subscriptions.push(
            this.client.subscribe(this.topic_single, (msg) => {
              this.handelMessage(JSON.parse(msg.body));
            })
          );
        },
        (err) => {
          console.log(err);
          if (this.connectTryNo < 30) {
            this.connect().then((suc) => {
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
          } else {
            this.loading_notification_short_hoover(
              'App lost backend Connection'
            );
            resolve(false);
            reject(true);
          }
        }
      );
    });
  }

  async logout(): Promise<boolean> {
    return await this.disConnect();
  }

  async disConnect(): Promise<boolean> {
    console.log('logging out');
    let _this = this;

    return await new Promise(async (resolve, reject) => {
      try {
        await this.terminateSoketCon(_this);
        await this.terminateWebrtcSoketCon();
        resolve(true);
        reject(false);
      } catch (error) {
        resolve(false);
        reject(true);
      }
    });
  }
  async terminateSoketCon(_this) {
    return new Promise((resolve, reject) => {
      try {
        if (_this.client != null) {
          _this.client.disconnect(function (frame) {
            console.log('STOMP client succesfully disconnected.');
            _this.subscriptions.forEach((s) => {
              s.unsubscribe();
            });
            _this.subscriptions.forEach((s) => {
              _this.subscriptions.pop();
            });
            _this.destroySession();
            if (_this.webSoket != null && _this.webSoket.OPEN) {
              _this.webSoket.close();
            }
            resolve(true);
            reject(false);
          });
        }
      } catch (error) {
        throw new Error(error);
      }
    });
  }

  async terminateWebrtcSoketCon() {
    return new Promise((resolve, reject) => {
      try {
        if (this.clientWebrtc != null) {
          this.clientWebrtc.disconnect(function (frame) {
            console.log('Wrtweb STOMP client succesfully disconnected.');
            if (this.generalService.webSoketWebrtc != null) {
              this.generalService.webSoketWebrtc.close();
            }
            resolve(true);
            reject(false);
          });
        }
      } catch (error) {
        throw new Error(error);
      }
    });
  }

  handelMessage(data: actionEvent) {
    switch (data.type) {
      case 'message':
        this.notify();
        this.store.dispatch(
          action.updateRecentSentText({
            sentText: data.msgr,
          })
        );
        this.store.dispatch(
          action.updateRecentSentTextChat({
            sentTextChat: data.msgr,
          })
        );
        break;
      case 'msgseennotifyall':
      case 'msgseennotify':
        console.log('#######################    in message notify');
        console.log(this.getFromLocal(this.currentchatid));
        console.log(data.msgr.chatid);
        console.log(
          this.getFromLocal(this.currentchatid) == data.msgr.chatid.toString()
        );
        if (
          this.getFromLocal(this.currentchatid) == data.msgr.chatid.toString()
        ) {
          console.log(this.getFromLocal(this.currentchatid));
          console.log(data.msgr.chatid.toString());
          console.log(data.msgr.id.toString());
          //this dispatching message id is not important , we just want to trigger the subscription so that
          //we can update the messages as seen. the value is not being used there.
          this.store.dispatch(
            action.updateMsgidupdate({
              msgidupdate: data.msgr.id.toString(),
            })
          );
        }
        break;
      case 'chatdelete':
        console.log('#######################    in chat delete');
        console.log(data.msgr.chatid);
        this.store.dispatch(
          action.updateDeletedchatid({ deletedchatid: data.msgr.chatid })
        );
        break;
      case 'messagedelete':
        console.log('#######################    in Message delete');
        console.log(data.msgr.id);
        this.store.dispatch(
          action.updateDeletedmessageidid({ deletedmessageidid: data.msgr.id })
        );
        break;
      case 'removesender':
        console.log('#######################    in removesender');
        console.log(data.msgr.id);
        this.store.dispatch(
          action.updateDeletedmessageidse({ deletedmessageidse: data.msgr.id })
        );
        break;
      case 'location':
        let names = data.to.split(' ');
        console.log(names.includes(this.getUser()));
        console.log(names);
        console.log(this.getUser());
        if (names.includes(this.getUser())) {
          // if (this.has_permission_to_share_loaction()) {
          Geolocation.getCurrentPosition({}).then((loc) => {
            let l: string = loc.coords.latitude.toString();
            let ln: string = loc.coords.longitude.toString();
            let location: string = l + '_' + ln + '_' + this.getUser();
            this.share_locations(location, data.from);
          });
          //}
        }
        break;
      case 'location_share':
        if (data.to == this.getUser()) {
          this.store.dispatch(
            action.updateOthersLocation({
              others_locations: [data.msgr.text],
            })
          );
        }
        break;
      case 'answer':
        if (data.from != this.getUser()) {
          this.store.dispatch(
            action.updateAns({
              ans: data.msgr.text,
            })
          );
        }
        break;
      case 'offer':
        if (data.from != this.getUser()) {
          console.log('in recieveing offer ');
          this.store.dispatch(
            action.updateOffer({
              offer: data.msgr.text,
            })
          );
        }
        break;
      case 'candidate':
        if (data.from != this.getUser()) {
          this.store.dispatch(
            action.updateCand({
              cand: data.msgr.text,
            })
          );
        }
        break;
      case 'call':
        this.store.dispatch(
          action.updateCall({
            call: data.msgr.text,
          })
        );

        break;

      case 'ansr':
        this.store.dispatch(
          action.updateansr({
            ansr: data.msgr.text,
          })
        );

        break;
      case 'end':
        this.store.dispatch(
          action.updateCallend({
            callend: data.msgr.text,
          })
        );

        break;
      default:
        break;
    }
  }

  saveInlocal(key, data) {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(data));
  }

  getFromLocal(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  loadMessageStore(user) {}
  loadMsgFromBack() {
    this.subscriptions.push(
      this.getMesssages(this.getUser()).subscribe((ml) => {
        this.msgs = ml;
      })
    );
  }

  getFileAsBlob(rawData: string) {
    //return this.httpClient.get(url.split('ob:')[1], { responseType: 'blob' });
    // return new Blob([rawData], { type: 'image/png' });
    const bytes = new Array(rawData.length);
    for (var x = 0; x < rawData.length; x++) {
      bytes[x] = rawData.charCodeAt(x);
    }
    const arr = new Uint8Array(bytes);
    const blob = new Blob([arr], { type: 'image/png' });
    return blob;
  }

  notify() {
    navigator.vibrate;
    let audio = new Audio();
    audio.src = 'assets/sound/notify.wav';
    audio.load();
    audio.play();
  }

  unit8ArrayDecode(data) {
    let de = new TextDecoder();
    return de.decode(data);
  }
  unit8ArrayEncode(data) {
    let en = new TextEncoder();
    return en.encode(data);
  }

  has_permission_to_share_loaction(): boolean {
    return true; //TOdo
  }

  loading_notification_short_hoover(msg) {
    console.log('loading started');
    this.loadingCtrl
      .create({
        message: msg,
        duration: this.notificationDurationfix,
      })
      .then((toast) => {
        toast.present();
      });
  }

  bypassUrlSecurity(data: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(data);
  }

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }

  blobToBase64_cap(blob: Blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const recordingResult = String(reader.result);
        const splitResult = recordingResult.split('base64,');
        const toResolve =
          splitResult.length > 1 ? splitResult[1] : recordingResult;
        resolve(toResolve.trim());
      };
      reader.readAsDataURL(blob);
    });
  }

  recordSendMessage() {
    return 'Voice message';
  }

  sendWebrtcCallMessage(text, rcv, type) {
    if (
      text != null &&
      text != '' &&
      rcv != '' &&
      type != '' &&
      this.getUser() != ''
    ) {
      let newMsge = new chatResponse(
        -1111,
        '00.00',
        1,
        0,
        text,
        false,
        this.getUser(),
        rcv
      );
      this.sendMessage2(newMsge, type);
    } else {
      throw new Error('Reciever or sender or text or type was empty');
    }
  }

  //#################### color service #########################################
  async createStorage() {
    await this.storage.create();
  }
  defaults = {
    primary: '#3880ff',
    secondary: '#0cd1e8',
    tertiary: '#7044ff',
    success: '#10dc60',
    warning: '#ffce00',
    danger: '#f04141',
    dark: '#222428',
    medium: '#989aa2',
    light: '#f4f5f8',
  };
  setTheme(theme) {
    return new Promise((resolve, reject) => {
      const cssText = this.CSSTextGenerator(theme);
      this.setGlobalCSS(cssText);
      this.storage.set('theme', cssText).then(
        (suc) => {
          resolve(suc);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  // Define a single CSS variable
  setVariable(name, value) {
    this.document.documentElement.style.setProperty(name, value);
  }

  private setGlobalCSS(css: string) {
    this.document.documentElement.style.cssText = css;
  }

  get storedTheme() {
    return this.storage.get('theme');
  }

  CSSTextGenerator(colors) {
    colors = { ...this.defaults, ...colors };

    const {
      primary,
      secondary,
      tertiary,
      success,
      warning,
      danger,
      dark,
      medium,
      light,
    } = colors;

    const shadeRatio = 0.1;
    const tintRatio = 0.1;
    const tintRatio2 = 0.7;

    return `
    --ion-color-base: ${light};
    --ion-color-contrast: ${dark};
    --ion-background-color: ${light};
    --ion-text-color: ${dark};
    --ion-toolbar-background-color: ${this.contrast(light, 0.1)};
    --ion-toolbar-text-color: ${this.contrast(dark, 0.1)};
    --ion-item-background-color: ${this.contrast(light, 0.3)};
    --ion-item-text-color: ${this.contrast(dark, 0.3)};

    --ion-color-primary: ${primary};
    --ion-color-primary-rgb: 56,128,255;
    --ion-color-primary-contrast: ${this.contrast(primary)};
    --ion-color-primary-contrast-rgb: 255,255,255;
    --ion-color-primary-shade:  ${Color(primary).darken(shadeRatio)};
    --ion-color-primary-tint:  ${Color(primary).lighten(tintRatio2)};

    --ion-color-secondary: ${secondary};
    --ion-color-secondary-rgb: 12,209,232;
    --ion-color-secondary-contrast: ${this.contrast(secondary)};
    --ion-color-secondary-contrast-rgb: 255,255,255;
    --ion-color-secondary-shade:  ${Color(secondary).darken(shadeRatio)};
    --ion-color-secondary-tint: ${Color(secondary).lighten(tintRatio2)};

    --ion-color-tertiary:  ${tertiary};
    --ion-color-tertiary-rgb: 112,68,255;
    --ion-color-tertiary-contrast: ${this.contrast(tertiary)};
    --ion-color-tertiary-contrast-rgb: 255,255,255;
    --ion-color-tertiary-shade: ${Color(tertiary).darken(shadeRatio)};
    --ion-color-tertiary-tint:  ${Color(tertiary).lighten(tintRatio2)};

    --ion-color-success: ${success};
    --ion-color-success-rgb: 16,220,96;
    --ion-color-success-contrast: ${this.contrast(success)};
    --ion-color-success-contrast-rgb: 255,255,255;
    --ion-color-success-shade: ${Color(success).darken(shadeRatio)};
    --ion-color-success-tint: ${Color(success).lighten(tintRatio)};

    --ion-color-warning: ${warning};
    --ion-color-warning-rgb: 255,206,0;
    --ion-color-warning-contrast: ${this.contrast(warning)};
    --ion-color-warning-contrast-rgb: 255,255,255;
    --ion-color-warning-shade: ${Color(warning).darken(shadeRatio)};
    --ion-color-warning-tint: ${Color(warning).lighten(tintRatio)};

    --ion-color-danger: ${danger};
    --ion-color-danger-rgb: 245,61,61;
    --ion-color-danger-contrast: ${this.contrast(danger)};
    --ion-color-danger-contrast-rgb: 255,255,255;
    --ion-color-danger-shade: ${Color(danger).darken(shadeRatio)};
    --ion-color-danger-tint: ${Color(danger).lighten(tintRatio)};

    --ion-color-dark: ${dark};
    --ion-color-dark-rgb: 34,34,34;
    --ion-color-dark-contrast: ${this.contrast(dark)};
    --ion-color-dark-contrast-rgb: 255,255,255;
    --ion-color-dark-shade: ${Color(dark).darken(shadeRatio)};
    --ion-color-dark-tint: ${Color(dark).lighten(tintRatio)};

    --ion-color-medium: ${medium};
    --ion-color-medium-rgb: 152,154,162;
    --ion-color-medium-contrast: ${this.contrast(medium)};
    --ion-color-medium-contrast-rgb: 255,255,255;
    --ion-color-medium-shade: ${Color(medium).darken(shadeRatio)};
    --ion-color-medium-tint: ${Color(medium).lighten(tintRatio)};

    --ion-color-light: ${light};
    --ion-color-light-rgb: 244,244,244;
    --ion-color-light-contrast: $${this.contrast(light)};
    --ion-color-light-contrast-rgb: 0,0,0;
    --ion-color-light-shade: ${Color(light).darken(shadeRatio)};
    --ion-color-light-tint: ${Color(light).lighten(tintRatio)};`;
  }

  contrast(color, ratio = 0.8) {
    color = Color(color);
    return color.isDark() ? color.lighten(ratio) : color.darken(ratio);
  }
}
