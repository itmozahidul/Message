import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonList } from '@ionic/angular';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-new-friend',
  templateUrl: './new-friend.component.html',
  styleUrls: ['./new-friend.component.scss'],
})
export class NewFriendComponent implements OnInit, AfterViewInit {
  @ViewChild('cilist') cilist:IonList;
  
  subscriptionList: any[];
  items: any[];
  constructor(private generalService:GeneralService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    
    
  }

  srch(key:string){
    if(key!=""){
      this.generalService.searchUserByName(key).subscribe(us=>{
        this.items=us;
      });
    }else{
      this.items= [];
    }
    

  }

  ngOnDestroy() {
    this.subscriptionList=[];
  }

}
