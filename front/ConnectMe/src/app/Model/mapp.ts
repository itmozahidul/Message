import { chatResponse } from '../DTO/chatResponse';
import { Friend } from './Friend';
export class Mapp {
  val: Friend[];

  constructor() {
    this.val = [];
  }

  set(key: string, v: chatResponse[]) {
    debugger;
    let newFriend: boolean = true;
    for (let d of this.val) {
      if (d.getKey() == key) {
        newFriend = false;
        for (let newMsg of v) {
          d.insertValue(newMsg);
        }
      }
    }
    if (newFriend) {
      this.val.unshift(new Friend(key, v));
    }
  }
  get(key: string) {
    let ans: chatResponse[] = [];
    let temp: Friend[] = [];
    for (let d of this.val) {
      if (d.getKey() == 'key') {
        ans = d.getValue();
      } else {
        temp.push(d);
      }
    }
    this.val = temp;
    temp = [];
    return ans;
  }

  clear() {
    this.val = [];
  }
  delete(key: string) {
    let temp: Friend[] = [];
    for (let d of this.val) {
      if (d.getKey() != 'key') {
        temp.push(d);
      }
    }
    this.val = temp;
    temp = [];
  }
  entries(): IterableIterator<[number, Friend]> {
    return this.val.entries();
  }
  has(key: string): boolean {
    let temp: boolean = false;
    for (let d of this.val) {
      if (d.getKey() == 'key') {
        temp = true;
      }
    }
    return temp;
  }
  keys(): string[] {
    let temp: string[];
    for (let d of this.val) {
      temp.push(d.getKey());
    }
    return temp;
  }
  size(): number {
    return this.val.length;
  }
  values(): Array<chatResponse[]> {
    let temp: Array<chatResponse[]> = new Array();
    for (let d of this.val) {
      temp.push(d.getValue());
    }
    return temp;
  }
  forEach() {
    return this.val.forEach;
  }
}
