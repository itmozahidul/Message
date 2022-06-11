import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaxLengthValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { chatResponse } from '../DTO/chatResponse';
import { Message } from '../Model/message';
import { GeneralService } from '../service/general.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit,OnDestroy {
  msgs:chatResponse[] = [];
  newMsg:Message=null;
  reciever:string=null;
  subscriptionList = [];
  
  constructor(
    private activatedroute:ActivatedRoute,
    private _router:Router,
    private generalService:GeneralService,
    private http: HttpClient) { 

    }
  ngOnDestroy(): void {
    this.generalService.disConnect();
    this.subscriptionList = [];
  }

  ngOnInit() {
    this.generalService.connect();
    this.subscriptionList.push(
      this.activatedroute.paramMap.subscribe(params => { 
        this.reciever=params.get('friend');
        let rspns = this.generalService.loadMessagesFromStore();
        this.msgs = rspns.get(this.reciever);
      })
    );
   this.msgs.push(new chatResponse("12.00", "Hi how are you?", false, this.generalService.getUser(),"shakil")); 
   this.msgs.push(new chatResponse("12.00", "I am fine and you?", false, "shakil", this.generalService.getUser()));
  }

  send(data){
    console.log(data);
    this.newMsg = new chatResponse("12.00", data.value, false, this.generalService.getUser(),this.reciever); 
    data.value = "";
    this.generalService.sendMessage(this.newMsg);

  }

  

}
