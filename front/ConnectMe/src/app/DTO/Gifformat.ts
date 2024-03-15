export class Gifformat {
  url: string;
  itemurl: string;
  hasaudio: string;
  title: string;
  constructor(url, itemurl, hasaudio, title) {
    this.hasaudio = hasaudio;
    this.itemurl = itemurl;
    this.title = title;
    this.url = url;
  }
}
