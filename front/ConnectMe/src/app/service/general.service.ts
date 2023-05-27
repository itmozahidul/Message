import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Store } from '@ngrx/store';
import jwt_decode from 'jwt-decode';
import { State } from '../Store/reducer';
import * as action from '../Store/action';
import * as Stomp from 'stompjs';
import { chatResponse } from '../DTO/chatResponse';
import { Observable } from 'rxjs';
import * as selector from '../store/selector';
import { actionEvent } from '../DTO/actionEvent';
import { encode } from 'querystring';
import { environment } from 'src/environments/environment.prod';

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
  jwtToken: string;
  decodedToken: { [key: string]: string };
  topic: string = '/topic/messages';
  client: Stomp.Client = null;
  webSoket: WebSocket = null;
  msgStore = {};
  msgs: chatResponse[] = [];
  msgs$: Observable<chatResponse[]>;
  reciever: string = null;
  reciever$: Observable<string>;
  subscriptions = [];

  constructor(private httpClient: HttpClient, private store: Store<State>) {
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

  updateMsgSeen(id: number, ans: boolean) {
    //const params = new HttpParams().set('id', id).set('ans', ans);
    console.log('msg seen rqst sent to backend');
    return this.httpClient.post<any>(
      this.endpoint + '/message/messageSeen',
      [id, ans],
      this.httpHeader
    );
  }

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
    console.log(parseInt(this.getExpiryTime()));
    const expiryTime: number = parseInt(this.getExpiryTime());
    if (expiryTime) {
      return 1000 * expiryTime - new Date().getTime() < 5000;
    } else {
      return false;
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
  connect() {
    return new Promise((resolve, reject) => {
      this.webSoket = new WebSocket(this.getWebsoketUrl());
      this.client = Stomp.over(this.webSoket);
      this.client.connect(
        { Authorization: this.getBearerToken() },
        (suc) => {
          resolve(true);
          reject(false);
          console.log(suc);
          this.subscriptions.push(
            this.client.subscribe(this.topic, (msg) => {
              this.handelMessage(JSON.parse(msg.body));
            })
          );
        },
        (err) => {
          console.log(err);
          resolve(false);
          reject(true);
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
        // condition is useless
        console.log(
          data.from == this.getUser() || data.to == this.getUser()
            ? 'data relavant to user'
            : 'data is not relavant to user'
        );
        if (data.from == this.getUser() || data.to == this.getUser()) {
          //this.msgs.push(data.msgr);
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
          /* this.store.dispatch(
            action.updateViewdMessage({
              msgs: this.msgs,
            })
          ); */

          /* this.getMesssages(this.getUser()).subscribe((ml) => {
              this.store.dispatch(
                action.updateCurrentChatHeads({
                  currentChatHeads: ml,
                })
              );
            }); */
        }
        /* else {
          if (data.to == this.getUser()) {
            console.log('updating msgs...');
            this.getMesssages(this.getUser()).subscribe((ml) => {
              console.log(ml);
              this.store.dispatch(
                action.updateCurrentChatHeads({
                  currentChatHeads: ml,
                })
              );
            });
          }
        } */
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
      console.log(localStorage.getItem(key));
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
}
