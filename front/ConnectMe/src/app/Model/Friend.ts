import { chatResponse } from "../DTO/chatResponse";
export class Friend {
  key: string;
  value: chatResponse;

  constructor(key: string, value: chatResponse) {
    this.key = key;
    this.value = value;
  }

  getKey() {
    return this.key;
  }
  getValue() {
    return this.value;
  }
}
