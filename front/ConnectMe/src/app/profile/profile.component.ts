import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../service/general.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { State } from '../store/reducer';
import * as selector from '../store/selector';
import * as action from '../store/action';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IonContent,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Observable } from 'rxjs';
import { registerUser } from '../model/registerUser';
import { updateUser } from '../model/updateUser';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Profile } from '../model/profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  showAdvance: boolean = false;
  edit: boolean;
  currentUser = '';
  currrentUser$: Observable<string>;
  subscriptionList = [];
  user: updateUser = new updateUser('', '', '', '', '', '', '', '');
  profile: Profile = new Profile();
  tempImageStore: string;
  //booleans for editing
  //User
  efname: boolean = false;
  elname: boolean = false;
  emobile: boolean = false;
  eadress: boolean = false;
  eimage: boolean = false;
  erole: boolean = false;
  //Profile
  ecity: boolean = false;
  eplz: boolean = false;
  ecountry: boolean = false;
  eiban: boolean = false;
  estreet: boolean = false;
  ehouse: boolean = false;
  emusics: boolean = false;
  emovies: boolean = false;
  ehobby: boolean = false;
  eabout: boolean = false;
  epost: boolean = false;
  estatus: boolean = false;
  eschool: boolean = false;
  euniversity: boolean = false;
  eeducation: boolean = false;
  ejob: boolean = false;
  eexperience: boolean = false;
  esecretquestion1: boolean = false;
  esecretquestion2: boolean = false;
  esecretquestion3: boolean = false;
  eanswer1: boolean = false;
  eanswer2: boolean = false;
  eanswer3: boolean = false;
  egps_location: boolean = false;
  ejoined: boolean = false;
  //values
  //User
  fname: string = 'loading..';
  lname: string = 'loading..';
  mobile: string = 'loading..';
  adress: string = 'loading..';
  image: string = '../assets/avatar.png';
  image$: Observable<string>;
  role: string = 'loading..';
  //Profile
  city: string = 'loading..';
  plz: string = 'loading..';
  country: string = 'loading..';
  iban: string = 'loading..';
  street: string = 'loading..';
  house: string = 'loading..';
  musics: string = 'loading..';
  movies: string = 'loading..';
  hobby: string = 'loading..';
  about: string = 'loading..';
  post: string = 'loading..';
  status: string = 'loading..';
  school: string = 'loading..';
  university: string = 'loading..';
  education: string = 'loading..';
  job: string = 'loading..';
  experience: string = 'loading..';
  secretquestion1: string = 'loading..';
  secretquestion2: string = 'loading..';
  secretquestion3: string = 'loading..';
  answer1: string = 'loading..';
  answer2: string = 'loading..';
  answer3: string = 'loading..';
  gps_location: string = 'loading..';
  joined: string = 'loading..';

  constructor(
    private store: Store<State>,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private general: GeneralService,
    private http: HttpClient,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalController: ModalController
  ) {
    this.currrentUser$ = this.store.select(selector.selectCurrentUser);
    this.image$ = this.store.select(selector.selectUserImage);
  }

  ngOnDestroy(): void {
    /* console.log('destroying message component');
    this.subscriptionList.forEach((s) => {
      s.unsubscribe();
      this.subscriptionList.pop();
    }); */
    //this.generalService.disConnect();
    //this.router.navigate(['/chat', '']);
  }

  ngOnInit() {
    this.loadingStart('');
  }
  init_observable_data() {
    this.image$.subscribe(
      (s) => {
        console.log(s);
        if (s == '') {
          let nimage: string = '';
          this.general.getUserPhoto(this.general.getUser()).subscribe(
            (suc) => {
              if (suc[0].length > 0) {
                nimage = suc[0];
              } else {
                nimage = 'assets/avatar.png';
              }
              this.store.dispatch(action.updateUserImage({ image: nimage })); //from backend image comes as an array
            },
            (err) => {
              console.log(err);
              this.image = 'assets/avatar.png';
            }
          );
        } else {
          this.image = s;
        }
      },
      (errr) => {
        console.log(errr);
        this.image = 'assets/avatar.png';
      }
    );

    this.subscriptionList.push(
      this.currrentUser$.subscribe((s) => {
        if (s.length > 0) {
          this.currentUser = s;
          this.preparedata(s);
        } else {
          let u = this.general.getUser();
          if (u.length > 0) {
            this.currentUser = u;
            this.preparedata(u);
            this.store.dispatch(action.updateurrentUser({ currentUser: u }));
            this.loadingEnd();
          } else {
            this.loadingEnd();
            this.toastCtrl
              .create({
                message: 'you are logged out',
                duration: 3000,
                position: 'bottom',
              })
              .then((toast) => {
                toast.present();
                this.router.navigate(['login']);
              });
          }
        }
      }),
      (err) => {
        console.log(err);
        this.loadingEnd();
      }
    );
  }
  preparedata(s: string) {
    this.subscriptionList.push(
      this.general.getUserbyName(s).subscribe(
        (u) => {
          this.user = u;
          this.init_user_data();
          this.subscriptionList.push(
            this.general.getProfileByUserId(u.id).subscribe(
              (p) => {
                this.profile = p;
                this.init_user_profile_data();
                this.loadingEnd();
                console.log(this.profile);
              },
              (err) => {
                console.log(err);
                this.loadingEnd();
              }
            )
          );
        },
        (err) => {
          console.log(err);
          this.loadingEnd();
          this.user = new updateUser(
            '',
            'load..',
            'load..',
            'load..',
            'load..',
            'load..',
            '../asset/avatar.png',
            'unknown'
          );
        }
      )
    );
  }

  init_user_data() {
    this.fname = this.user.fname;
    this.lname = this.user.lname;
    this.adress = this.user.adress;
    this.image = this.user.image;
    this.tempImageStore = this.user.image;
    this.mobile = this.user.mobile;
    this.role = this.user.role;
  }
  init_user_profile_data() {
    this.city = this.profile.city;
    this.plz = this.profile.plz;
    this.country = this.profile.country;
    this.iban = this.profile.iban;
    this.street = this.profile.street;
    this.house = this.profile.house;
    this.musics = this.profile.musics;
    this.movies = this.profile.movies;
    this.hobby = this.profile.hobby;
    this.about = this.profile.about;
    this.post = this.profile.post;
    this.status = this.profile.status;
    this.school = this.profile.school;
    this.university = this.profile.university;
    this.education = this.profile.education;
    this.job = this.profile.job;
    this.experience = this.profile.experience;
    this.secretquestion1 = this.profile.secretquestion1;
    this.secretquestion2 = this.profile.secretquestion2;
    this.secretquestion3 = this.profile.secretquestion3;
    this.answer1 = this.profile.answer1;
    this.answer2 = this.profile.answer2;
    this.answer3 = this.profile.answer3;
    this.gps_location = this.profile.gps_location;
    this.joined = this.profile.joined;
  }

  loadingStart(msg) {
    console.log('loading started');
    this.loadingCtrl
      .create({
        message: msg,
      })
      .then((toast) => {
        toast.present();
        this.init_observable_data();
      });
  }
  loadingEnd() {
    console.log('loading ended');

    /* setTimeout(() => {
      
    }, 3000); */
    try {
      this.loadingCtrl.dismiss().then(
        (suc) => {
          console.log(suc);
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  update(key) {
    switch (key) {
      //User_relavant
      case 'fname':
        this.user.fname = this.fname;
        this.updateSingleUserEntry(key, this.fname);
        break;
      case 'lname':
        this.user.lname = this.lname;
        this.updateSingleUserEntry(key, this.lname);
        break;
      case 'adress':
        this.user.adress = this.adress;
        this.updateSingleUserEntry(key, this.adress);
        break;
      case 'mobile':
        this.user.mobile = this.mobile;
        this.updateSingleUserEntry(key, this.mobile);
        break;
      case 'role':
        this.user.role = this.role;
        this.updateSingleUserEntry(key, this.role);
        break;
      case 'image':
        this.user.image = this.image;
        this.updateSingleUserEntry(key, this.image);
        break;
      //Profile_relevant
      case 'city':
        this.profile.city = this.city;
        this.updateSingleProfileEntry(key, this.city);
        break;
      case 'plz':
        this.profile.plz = this.plz;
        this.updateSingleProfileEntry(key, this.plz);
        break;
      case 'country':
        this.profile.country = this.country;
        this.updateSingleProfileEntry(key, this.country);
        break;
      case 'iban':
        this.profile.iban = this.iban;
        this.updateSingleProfileEntry(key, this.iban);
        break;
      case 'street':
        this.profile.street = this.street;
        this.updateSingleProfileEntry(key, this.street);
        break;
      case 'house':
        this.profile.house = this.house;
        this.updateSingleProfileEntry(key, this.house);
        break;
      case 'musics':
        this.profile.musics = this.musics;
        this.updateSingleProfileEntry(key, this.musics);
        break;
      case 'movies':
        this.profile.movies = this.movies;
        this.updateSingleProfileEntry(key, this.movies);
        break;
      case 'hobby':
        this.profile.hobby = this.hobby;
        this.updateSingleProfileEntry(key, this.hobby);
        break;
      case 'about':
        this.profile.about = this.about;
        this.updateSingleProfileEntry(key, this.about);
        break;
      case 'post':
        this.profile.post = this.post;
        this.updateSingleProfileEntry(key, this.post);
        break;
      case 'school':
        this.profile.school = this.school;
        this.updateSingleProfileEntry(key, this.school);
        break;
      case 'university':
        this.profile.university = this.university;
        this.updateSingleProfileEntry(key, this.university);
        break;
      case 'education':
        this.profile.education = this.education;
        this.updateSingleProfileEntry(key, this.education);
        break;
      case 'job':
        this.profile.job = this.job;
        this.updateSingleProfileEntry(key, this.job);
        break;
      case 'experience':
        this.profile.experience = this.experience;
        this.updateSingleProfileEntry(key, this.experience);
        break;
      case 'secretquestion1':
        this.profile.secretquestion1 = this.secretquestion1;
        this.updateSingleProfileEntry(key, this.secretquestion1);
        break;
      case 'secretquestion2':
        this.profile.secretquestion2 = this.secretquestion2;
        this.updateSingleProfileEntry(key, this.secretquestion2);
        break;
      case 'secretquestion3':
        this.profile.secretquestion3 = this.secretquestion3;
        this.updateSingleProfileEntry(key, this.secretquestion3);
        break;
      case 'answer1':
        this.profile.answer1 = this.answer1;
        this.updateSingleProfileEntry(key, this.answer1);
        break;
      case 'answer2':
        this.profile.answer2 = this.answer2;
        this.updateSingleProfileEntry(key, this.answer2);
        break;
      case 'answer3':
        this.profile.answer3 = this.answer3;
        this.updateSingleProfileEntry(key, this.answer3);
        break;
      case 'gps_location':
        this.profile.gps_location = this.gps_location;
        this.updateSingleProfileEntry(key, this.gps_location);
        break;
      case 'joined':
        this.profile.joined = this.joined;
        this.updateSingleProfileEntry(key, this.joined);
        break;

      default:
        break;
    }
  }
  editdata() {
    this.edit = true;
  }

  getPhoto() {
    Camera.getPhoto({
      quality: 10,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      width: 10,
      height: 10,
      //resultType: CameraResultType..Base64,
    }).then(
      (image) => {
        console.log(image);
        const imageUrl = image.dataUrl;
        this.tempImageStore = this.user.image;
        this.store.dispatch(action.updateUserImage({ image: imageUrl }));

        this.update('image');
      },
      (err) => {
        console.log('image is canceled');
        this.user.image = this.tempImageStore;
      }
    );
  }
  cancelEdit() {
    this.edit = false;
  }
  updateSingleProfileEntry(key: string, value: string) {
    let data = {
      key: key,
      p_id: this.profile.id,
      value: value,
    };
    this.general.updateSingleProfileEntry(data).subscribe(
      (suc) => {
        //this.edit = false;
      },
      (err) => {
        console.log(err);
        //this.errommsg = JSON.stringify(err);
        this.edit = true;
      }
    );
  }
  updateSingleUserEntry(key: string, value: string) {
    let data = {
      key: key,
      p_id: this.general.getUser(),
      value: value,
    };
    this.general.updateSingleUserEntry(data).subscribe(
      (suc) => {
        //this.edit = false;
      },
      (err) => {
        console.log(err);
        //this.errommsg = JSON.stringify(err);
        this.edit = true;
      }
    );
  }

  setEditMode(key: string, value: boolean) {
    switch (key) {
      //User_relavant
      case 'fname':
        console.log(key);
        console.log(value);
        this.efname = value;
        break;
      case 'lname':
        this.elname = value;
        break;
      case 'adress':
        this.eadress = value;
        break;
      case 'mobile':
        this.emobile = value;
        break;
      case 'role':
        this.erole = value;
        break;
      case 'image':
        this.eimage = value;
        break;
      //Profile_relevant
      case 'city':
        this.ecity = value;
        break;
      case 'plz':
        this.eplz = value;
        break;
      case 'country':
        this.ecountry = value;
        break;
      case 'iban':
        this.eiban = value;
        break;
      case 'street':
        this.estreet = value;
        break;
      case 'house':
        this.ehouse = value;
        break;
      case 'musics':
        this.emusics = value;
        break;
      case 'movies':
        this.emovies = value;
        break;
      case 'hobby':
        this.ehobby = value;
        break;
      case 'about':
        this.eabout = value;
        break;
      case 'post':
        this.epost = value;
        break;
      case 'school':
        this.eschool = value;
        break;
      case 'university':
        this.euniversity = value;
        break;
      case 'education':
        this.eeducation = value;
        break;
      case 'job':
        this.ejob = value;
        break;
      case 'experience':
        this.eexperience = value;
        break;
      case 'secretquestion1':
        this.esecretquestion1 = value;
        break;
      case 'secretquestion2':
        this.esecretquestion2 = value;
        break;
      case 'secretquestion3':
        this.esecretquestion3 = value;
        break;
      case 'answer1':
        this.eanswer1 = value;
        break;
      case 'answer2':
        this.eanswer2 = value;
        break;
      case 'answer3':
        this.eanswer3 = value;
        break;
      case 'gps_location':
        this.egps_location = value;
        break;
      case 'joined':
        this.ejoined = value;
        break;

      default:
        break;
    }
  }
}
