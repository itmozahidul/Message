
export class chatResponse{
    type:string;
    time:string;
    text:string;
    seen:boolean;
    sender:any;
    reciever:any;

    constructor(time:string,text:string,seen:boolean,sender:any,reciever:any){
       this.reciever=reciever;
       this.sender=sender;
       this.text=text;
       this.time=time;
       this.seen=seen;
    }

}