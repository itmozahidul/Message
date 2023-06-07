export class updateUser {
  id: string;
  name: string;
  fname: string;
  lname: string;
  mobile: string;
  adress: string;
  image: string;
  role: string;

  constructor(
    id: string,
    name: string,
    fname: string,
    lname: string,
    mb: string,
    ad: string,
    img: string,
    role: string
  ) {
    this.adress = ad;
    this.mobile = mb;
    this.fname = fname;
    this.lname = lname;
    this.name = name;
    this.image = img;
    this.id = id;
    this.role = role;
  }
}
