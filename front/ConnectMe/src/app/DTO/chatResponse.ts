export class chatResponse {
  id: number;
  time: string;
  text: string;
  seen: boolean;
  sender: string;
  reciever: string;

  constructor(
    id: number,
    time: string,
    text: string,
    seen: boolean,
    sender: string,
    reciever: string
  ) {
    this.id = id;
    this.reciever = reciever;
    this.sender = sender;
    this.text = text;
    this.time = time;
    this.seen = seen;
  }
}
