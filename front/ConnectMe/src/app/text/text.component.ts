import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  @Input() text:string = "";
  @Input() sender:string = "";
  @Input() reciever:string = "";
  @Input() time:string = "";
  @Input() seen:boolean = false;
  @Input() user:string = "";
  isLeftSide:boolean = true;
  constructor() { }

  ngOnInit() {
    this.isLeftSide=this.leftSide()
  }

  leftSide(){
    return this.reciever===this.user?false:true;
  }

}
