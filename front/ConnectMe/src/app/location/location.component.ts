import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  IonContent,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Map, tileLayer, marker } from 'leaflet';
/* import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@awesome-cordova-plugins/native-geocoder/ngx'; */
import { NavigationExtras, Router } from '@angular/router';
import { GeneralService } from '../service/general.service';
import { Observable } from 'rxjs';
import { State } from '../store/reducer';
import * as selector from '../store/selector';
import { Store } from '@ngrx/store';
import * as action from '../store/action';
import * as L from 'leaflet';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit, AfterViewInit {
  accuracy = '';
  altitude = '';
  altitudeAccuracy = '';
  heading = '';
  speed = '';

  map: Map;
  newMarker: any;
  address: string[];
  advance = false;
  others_location: string[] = [];
  others_location$: Observable<string[]>;
  @ViewChild(IonContent) cnt: IonContent;
  location_finding_progress: boolean = false;

  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalController: ModalController,
    //private geocoder: NativeGeocoder,
    private router: Router,
    private generalService: GeneralService,
    private store: Store<State>
  ) {
    this.others_location$ = this.store.select(selector.selectOthersLocation);
  }

  ngOnInit() {
    this.others_location$.subscribe(
      (suc) => {
        this.others_location = suc;
        console.log(this.others_location);
        suc.forEach((pos) => {
          let e = pos.split('_');
          let latitude: any = e[0];
          let longitude: any = e[1];
          let u = e[2];
          new L.Marker(new L.LatLng(latitude, longitude), {
            draggable: true,
          })
            .addTo(this.map)
            .bindPopup(u + ' is located here!')
            .openPopup();
          this.location_finding_progress = false;
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.locatePosition();
    }, 1000);
  }

  //#################

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    this.map = new Map('map').setView([17.385, 78.4867], 13);

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.map
    );
    // This line is added to add the Tile Layer to our map
  }

  locatePosition() {
    this.map.locate({ setView: true }).on('locationfound', (e: any) => {
      this.newMarker = marker([e.latitude, e.longitude], {
        draggable: true,
      }).addTo(this.map);
      this.newMarker.bindPopup('You are located here!').openPopup();

      this.newMarker.on('dragend', () => {
        const position = this.newMarker.getLatLng();
      });
    });
  }

  /*  getAddress(lat: number, long: number) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };
    this.geocoder.reverseGeocode(lat, long, options).then((results) => {
      this.address = Object.values(results[0]).reverse();
    });
  }

  // The function below is added
  confirmPickupLocation() {
    let navigationextras: NavigationExtras = {
      state: {
        pickupLocation: this.address,
      },
    };
    this.router.navigate(['home'], navigationextras);
  }
 */
  //###################

  async goToChat() {
    await this.modalController.dismiss({
      dismissed: true,
    });
    //await this.loadingStart('loading...');
  }

  get_all_locations() {
    this.generalService.get_locations();
  }

  public scrollBottom(): void {
    setTimeout(() => {
      this.cnt.scrollToBottom();
    }, 200);
  }
}
