export class Message {
  text: string;
  sender: string;
  reciever: string;
  time: string;
  seen: boolean;
  data: FormData;

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
  }
}
