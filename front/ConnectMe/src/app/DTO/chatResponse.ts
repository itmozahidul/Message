export class chatResponse {
  id: number;
  time: string;
  text: string;
  seen: boolean;
  sender: string;
  reciever: string;
  data: FormData;

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
    this.data = null;
  }
}
