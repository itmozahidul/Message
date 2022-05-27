
export class chatResponse{
    time:string;
    text:string;
    seen:boolean;
    sender:string;
    reciever:string;

    constructor(time:string,text:string,seen:boolean,sender:string,reciever:string){
       this.reciever=reciever;
       this.sender=sender;
       this.text=text;
       this.time=time;
       this.seen=seen;
    }

}