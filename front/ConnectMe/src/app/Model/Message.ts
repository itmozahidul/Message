export class Message {
  text: string;
  sender: string;
  reciever: string;
  time: string;
  seen: boolean;
  data: string;
  type: string;

  constructor(
    text: string,
    sender: string,
    reciever: string,
    time: string,
    seen: boolean
  ) {
    this.text = text;
    this.sender = sender;
    this.reciever = reciever;
    this.time = time;
    this.seen = seen;
    this.data = null;
    this.type = 'text';
  }
}
