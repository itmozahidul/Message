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
import { chatResponse } from '../DTO/chatResponse';

@Component({
  selector: 'app-dynamic-profile',
  templateUrl: './dynamic-profile.component.html',
  styleUrls: ['./dynamic-profile.component.scss'],
})
export class DynamicProfileComponent implements OnInit {
  showAdvance: boolean = false;
  edit: boolean;
  currentUser = '';
  currrentUser$: Observable<string>;
  subscriptionList = [];
  user: updateUser = new updateUser('', '', '', '', '', '', '', '');
  profile: Profile = new Profile();
  tempImageStore: string;
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
  chatid: string = '';
  chatid$: Observable<string>;
  constructor(
    private store: Store<State>,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private general: GeneralService,
    private http: HttpClient,
    public toastCtrl: ToastController,
    public modalController: ModalController
  ) {
    this.chatid$ = this.store.select(selector.selectCurrentchatid);
  }

  ngOnInit() {
    this.loadingStart('');
    this.subscreibtochatid();
  }
  subscreibtochatid() {
    this.chatid$.subscribe((m) => {
      this.chatid = m;
    });
  }
  gotoChatDetail() {
    if (this.user.name != this.general.getUser()) {
      let data = {
        name: this.user.name,
      };
      this.general.createChat(this.user.name).subscribe(
        (suc) => {
          console.log(suc);
          this.endModal();
          this.gotoChatDetail2(suc.id.toString(), this.user.name);
          console.log(suc);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  gotoChatDetail2(key, name) {
    //we need to save the chat id again incase this function would be called from not active routing map
    console.log('go to chat detail of ' + key);
    this.general.saveInlocal(this.general.currentchatid, key);
    this.general.saveInlocal(this.general.currentrecieverlocal, name);

    // before going to chat making all messages seen
    this.store.dispatch(
      action.updateCurrentReciever({
        currentReciever: name,
      })
    );
    this.store.dispatch(
      action.updateCurrrentchatid({
        currentchatid: key,
      })
    );
    console.log('go to chat detail of ' + key);
    //this.presentMessageModal();
    this.router.navigate(['/message']);
  }
  preparedata(s: string) {
    console.log('prepearing user profile for ' + s);
    this.subscriptionList.push(
      this.general.getUserbyName(s).subscribe(
        (u) => {
          console.log(u);
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
    this.joined = this.profile.joined.split(' ')[0];
  }

  endModal() {
    this.modalController.dismiss();
  }

  loadingStart(msg) {
    console.log('loading started');
    this.general.loadingCtrl
      .create({
        message: msg,
      })
      .then((toast) => {
        toast.present();
        this.activatedroute.paramMap.subscribe((params) => {
          console.log('in dynamic profile and param url is');
          let name = params.get('user');
          console.log(name);
          if (
            name != undefined &&
            name != null &&
            name.length > 0 &&
            name.trim() != ''
          ) {
            this.init_observable_data(name);
          } else {
            //this.get_Data_From_the_backend();
          }
        });
      });
  }
  init_observable_data(user) {
    console.log('inititializing observable data...');
    this.general.getUserPhoto(user).subscribe(
      (suc) => {
        if (suc[0].length > 0) {
          this.image = suc[0];
        } else {
          this.image = 'assets/avatar.png';
        }
      },
      (err) => {
        console.log(err);
        this.image = 'assets/avatar.png';
      }
    );
    this.currentUser = user;
    this.preparedata(user);
    this.loadingEnd();
  }
  loadingEnd() {
    console.log('loading ended');

    /* setTimeout(() => {
      
    }, 3000); */
    try {
      this.general.loadingCtrl.dismiss().then(
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
}
