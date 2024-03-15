export class chatResponse {
  id: number;
  time: string;
  timemili: number;
  deleted: number;
  text: string;
  seen: boolean;
  sender: string;
  reciever: string;
  data: string;
  type: string;
  chatid: string = '';

  constructor(
    id: number,
    time: string,
    timemili: number,
    deleted: number,
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
    this.timemili = timemili;
    this.seen = seen;
    this.data = null;
    this.type = 'text';
    this.deleted = deleted;
  }
}
