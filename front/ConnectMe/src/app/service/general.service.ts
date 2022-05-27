import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Store } from '@ngrx/store';
import jwt_decode from 'jwt-decode';
import { State } from '../Store/reducer';
import * as action from '../Store/action';
import * as Stomp from 'stompjs';
import { chatResponse } from '../DTO/chatResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  endpoint = 'http://localhost:8080';
  wsendpoint = 'ws://localhost:8080';
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  } 
  jwtToken: string;
  decodedToken: { [key: string]: string };
  topic:string= '/topic/messages';
  client:Stomp.Client = null;
  webSoket:WebSocket = null;
  msgStore = {}

  constructor(
    private httpClient: HttpClient,
    private store:Store<State>,
  ) { }
  register(data){
    return this.httpClient.post<any>(this.endpoint + '/user/register', JSON.stringify(data), this.httpHeader)
  }
  login(data){
    return this.httpClient.post<any>(this.endpoint + '/user/login', JSON.stringify(data), this.httpHeader)
  }
  getMesssages(user:string):Observable<chatResponse[]>{
    return this.httpClient.post<any>(this.endpoint + '/message/all', user, this.httpHeader)
  }
  getMesssagesbyUser(user:string):Observable<chatResponse[]>{
    return this.httpClient.post<any>(this.endpoint + '/message/user', user, this.httpHeader)
  }
  searchUserByName(key:string):Observable<string[]>{
    return this.httpClient.post<any>(this.endpoint + '/user/search', key, this.httpHeader)
  }
  showBusy(){
    let p = document.createElement("div");
    p.setAttribute("id","busyid");
    p.setAttribute("style","position:absolute;width:100%;height:100%;background-color:#ffffff7a;");
    document.body.appendChild(p);
    
  }
  endBusy(){
    document.getElementById("busyid").remove();
  }
  prepareSession(token){
    let ans:boolean=false;
    ans = this.setToken(token);
   
    if(ans){ 
      let currentUser=this.getUser();
      localStorage.setItem("currentUser", currentUser);
      console.log("in  g service");
      console.log(currentUser);
      this.store.dispatch(action.updateurrentUser({currentUser}));
    }
    return ans;
  }
  setToken(token: string):boolean {
    if (token) {
      localStorage.setItem("token",token);
      return true;
    }else{
      return false;
    }
  }

  getToken(){
    return localStorage.getItem("token");
  }
  getBearerToken(){
    return "Bearer "+localStorage.getItem("token");
  }

  getDecodeToken() {
    let ans = null;
    if (localStorage.getItem("token")) {
    ans = jwt_decode(localStorage.getItem("token"));
    
    }else{
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

  /* isTokenExpired(): boolean {
    const expiryTime: number = parseInt(this.getExpiryTime());
    if (expiryTime) {
      return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
    } else {
      return false;
    }
  } */

  getWebsoketUrl(){
    return this.wsendpoint+'/ws';
  }
  getWebsoket(){
    return new WebSocket(this.getWebsoketUrl());
  }
  sendMessage(msg){
    if(this.client != null){
      console.log("msg is being sents");
      this.client.send(
        '/app/broadcast',
        {Authorization:this.getBearerToken()},
        JSON.stringify(msg)
      );
    }
  }
  connect(){
    this.webSoket = new WebSocket(this.getWebsoketUrl());
    this.client = Stomp.over(this.webSoket);
    this.client.connect(
      {Authorization:this.getBearerToken()},
      ()=>{
        this.client.subscribe(this.topic,(msg)=>{
         this.handelMessage(msg); 
        });
      }
    );
  }

  disConnect(){
    //this.client.
  }

  handelMessage(msg){
console.log("msg is not handelds");
  }

  loadMessageStore(user){
    
  }
}
