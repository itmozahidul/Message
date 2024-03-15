export class actionEvent {
  time: string;
  timemili: number;
  type: string;
  from: string;
  to: string;
  msgr: any;

  constructor(
    time: string,
    timemili: number,
    type: string,
    from: string,
    to: string,
    data: any
  ) {
    this.to = to;
    this.from = from;
    this.time = time;
    this.timemili = timemili;
    this.type = type;
    this.msgr = data;
  }
}
