import { Component, Input, OnInit } from '@angular/core';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-themsapp',
  templateUrl: './themsapp.component.html',
  styleUrls: ['./themsapp.component.scss'],
})
export class ThemsappComponent implements OnInit {
  themes = {
    autumn: {
      primary: '#F78154',
      secondary: '#4D9078',
      tertiary: '#B4436C',
      light: '#FDE8DF',
      medium: '#FCD0A2',
      dark: '#B89876',
    },
    night: {
      primary: '#8CBA80',
      secondary: '#FCFF6C',
      tertiary: '#FE5F55',
      medium: '#BCC2C7',
      dark: '#F7F7FF',
      light: '#495867',
    },
    neon: {
      primary: '#7d00fd',
      secondary: '#9237ef',
      tertiary: '#bc7aff',
      light: '#d6affd',
      medium: '#5e526b',
      dark: '#302a37',
    },
  };
  @Input() ux: string = '';
  name = '';
  selectedTheme = '';
  constructor(private generalService: GeneralService) {}

  ngOnInit() {
    console.log(this.ux);
    this.name = this.ux;
  }

  getcolorset(key) {
    switch (key) {
      case 'autumn':
        return this.themes.autumn;
        break;
      case 'night':
        return this.themes.night;
        break;
      case 'neon':
        return this.themes.neon;
        break;

      default:
        return {};
        break;
    }
  }

  handel(ele) {
    console.log(ele.value);
    this.selectedTheme = ele.value;
  }
  confirmTheme() {
    if (this.selectedTheme != '') {
      this.generalService.setTheme(this.getcolorset(this.selectedTheme)).then(
        (suc) => {
          this.generalService.loading_notification_short_hoover(
            'Theme is successfully changed!'
          );
        },
        (err) => {
          console.log(err);
          this.generalService.loading_notification_short_hoover(
            'Change of Theme has Failed!'
          );
        }
      );
    }
  }
}
