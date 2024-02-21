import { chatResponse } from './chatResponse';

export class Chathead {
  unreadMessageNo: any;
  name: any;
  createTime: any;
  id: any;
  rsp: chatResponse[];
  dynamicReciever: any;
  constructor(
    id: any,
    unreadMessageNo: any,
    rsp: chatResponse[],
    name: any,
    createTime: any
  ) {
    this.unreadMessageNo = unreadMessageNo;
    this.rsp = rsp;
    this.name = name;
    this.createTime = createTime;
    this.id = id;
  }
}
