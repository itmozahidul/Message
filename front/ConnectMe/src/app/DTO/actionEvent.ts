export class actionEvent {
  time: string;
  type: string;
  from: string;
  to: string;
  msgr: any;

  constructor(time: string, type: string, from: string, to: string, data: any) {
    this.to = to;
    this.from = from;
    this.time = time;
    this.type = type;
    this.msgr = data;
  }
}
