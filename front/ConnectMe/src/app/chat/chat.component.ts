import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonList } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { chatResponse } from '../DTO/chatResponse';
import { GeneralService } from '../service/general.service';
import { State } from '../store/reducer';
import * as selector from '../store/selector'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  currentUser:string = "";
  subscriptionList:any[] =[];
  currrentUser$:Observable<string>;
  items:any[]=[];
  friends:Map<string,chatResponse[]>= null;
  msgs:chatResponse[] = [];
  //@ViewChild('cilist') cilist:IonList;
  constructor(private store:Store<State>, private router:Router, private generalService:GeneralService) { 
    this.currrentUser$ = this.store.select(selector.selectCurrentUser);
  }

  ngOnInit() {
    console.log(this.generalService.getBearerToken());
    this.subscriptionList.push(
      this.currrentUser$.subscribe(s=>{
        this.currentUser=s;
        this.subscriptionList.push(
          this.generalService.getMesssages(s).subscribe(ml=>{
            this.msgs=ml;
            ml.forEach(m=>{
              if(m.reciever!=this.currentUser && !this.friends.has(m.reciever)){
                let msgsTemp:chatResponse[] = [];
                ml.forEach(umsg=>{
                  if((umsg.reciever==m.reciever && umsg.sender==this.currentUser)||(umsg.reciever==this.currentUser && umsg.sender==m.reciever)){
                    msgsTemp.push(umsg);
                  }
                });
                msgsTemp= this.sortMessages(msgsTemp, "Time");
                this.friends.set(m.reciever,msgsTemp);
              }
            });
          })
        );
      })
    );
    
    
  }

  ngAfterViewInit() {
    console.log(document.getElementById("listid"));
    this.items = []//Array.from(document.getElementById("listid").children);
    console.log(this.items);
    const searchbar = document.querySelector('ion-searchbar');
    searchbar.addEventListener('ionInput', (event)=>{
      console.log("input happened");
      const query = searchbar.value.toLowerCase();
      requestAnimationFrame(() => {
        this.items.forEach((item) => {
          const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
          item.style.display = shouldShow ? 'block' : 'none';
        });
      });
    });
  }
  ngOnDestroy() {
    this.subscriptionList=[];
  }
  gotoChatDetail(){
    this.generalService.connect();
  }
  sortMessages(ml:chatResponse[], type){
    switch (type) {
      case "time":
        let noChange:boolean = false;
        while(!noChange){
          for(let i=0;i<ml.length;i++){
            noChange=true;
            if(ml[i].time<ml[i+1].time){
              let temp:chatResponse = ml[i];
              ml[i] = ml[i+1];
              ml[i+1]=temp;
              noChange=false;
            }
          }
        }
        
        break;
    
      default:
        break;
    }
    return ml;
  }

  gotoNewFriend(){
    this.router.navigate(["newFriend"]);
  }

}
