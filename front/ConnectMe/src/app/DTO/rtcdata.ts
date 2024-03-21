export class rtcdata {
  type: string;
  sender: string;
  reciever: string;
  data: any;

  constructor(data: any, type: string, sender: string, reciever: string) {
    this.reciever = reciever;
    this.sender = sender;
    this.type = type;
    this.data = data;
  }
}
