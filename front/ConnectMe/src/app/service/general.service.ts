import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { Chathead } from '../DTO/chatHead';

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
  notificationDuration = 0;
  notificationDurationfix = 1000;
  jwtToken: string;
  decodedToken: { [key: string]: string };
  topic: string = '/topic/messages';
  topic_single: string = '/users/queue/reply';
  client: Stomp.Client = null;
  webSoket: WebSocket = null;
  msgStore = {};
  msgs: chatResponse[] = [];
  msgs$: Observable<chatResponse[]>;
  reciever: string = null;
  reciever$: Observable<string>;
  subscriptions = [];
  connectTryNo = 0;
  currentchatid = 'currentchatid';
  currentrecieverlocal = 'currentrecieverlocal';

  constructor(
    private httpClient: HttpClient,
    private store: Store<State>,
    public loadingCtrl: LoadingController,
    private sanitizer: DomSanitizer
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

  getChatHeadinfo(user: string): Observable<Chathead[]> {
    return this.httpClient.post<any>(
      this.endpoint + '/chat/chathead/user',
      [this.getUser(), user],
      this.httpHeader
    );
  }

  getChatHeadinfobychatid(id: string): Observable<Chathead> {
    return this.httpClient.post<any>(
      this.endpoint + '/chat/chathead',
      [id],
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

  updateallMsgSeenOfaUser(chatid: string) {
    //const params = new HttpParams().set('id', id).set('ans', ans);
    console.log('msg seen rqst sent to backend');
    return this.httpClient.post<any>(
      this.endpoint + '/message/all/messageSeen/user',
      [chatid, this.getUser()],
      this.httpHeader
    );
  }

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
  getWebsoket() {
    return new WebSocket(this.getWebsoketUrl());
  }
  sendMessage(msg) {
    //console.log(new Date().getTime().toString());
    let url = '/app/message';

    let to = msg.reciever;
    if (this.client != null) {
      let data = new actionEvent(
        new Date().getUTCDate().toString(),
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
    }
  }

  sendMessage2(d, type: string) {
    //console.log(new Date().getTime().toString());
    let url = '/app/message';

    if (this.client != null) {
      let data = new actionEvent(
        new Date().getUTCDate().toString(),
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
    }
  }

  sendMessageAll(msg) {
    //console.log(new Date().getTime().toString());
    let url = '/app/message';
    let to = msg.to;
    if (this.client != null) {
      let data = new actionEvent(
        new Date().getUTCDate().toString(),
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
    }
  }

  get_locations() {
    if (this.client != null) {
      let data = new actionEvent(
        new Date().getUTCDate().toString(),
        'location',
        this.getUser(),
        '',
        new chatResponse(-1, '', '', true, '', '')
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
        'location_share',
        this.getUser(),
        share,
        new chatResponse(-1, '', loc, true, '', '')
      );
      this.client.send(
        '/app/broadcast',
        { Authorization: this.getBearerToken() },
        JSON.stringify(data)
      );
    }
  }

  connect() {
    return new Promise((resolve, reject) => {
      console.log('websoket connect try no :' + this.connectTryNo);
      this.webSoket = new WebSocket(this.getWebsoketUrl());
      this.client = Stomp.over(this.webSoket);
      this.client.connect(
        { Authorization: this.getBearerToken(), username: this.getUser() },
        (suc) => {
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
          resolve(false);
          reject(true);
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
          }
        }
      );
    });
  }

  logout(): Promise<boolean> {
    return this.disConnect();
  }

  disConnect(): Promise<boolean> {
    let _this = this;

    return new Promise((resolve, reject) => {
      if (_this.client != null) {
        _this.client.disconnect(function (frame) {
          console.log('STOMP client succesfully disconnected.');
          _this.subscriptions.forEach((s) => {
            s.unsubscribe();
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
        console.log(this.getFromLocal(this.currentchatid) == data.msgr.chatid);
        if (
          this.getFromLocal(this.currentchatid) == data.msgr.chatid.toString()
        ) {
          this.store.dispatch(
            action.updateMsgidupdate({ msgidupdate: data.msgr.id })
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
}
