import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  tabs: Map<string, boolean> = new Map();
  notification = 'Notification';
  ux = 'User Experience';
  selected = 'Notification';
  originalOrder() {
    return 0;
  }
  constructor(private activatedroute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.tabs.set(this.notification, true);
    this.tabs.set(this.ux, false);
    this.selected = this.notification;
  }

  updateLocationsettings(event) {
    console.log(event);
    console.log(event.target.checked);
  }

  selectTab(key) {
    console.log(key);
    console.log(this.tabs);
    this.tabs.set(this.selected, false);
    console.log(this.tabs);
    this.tabs.set(key, true);
    console.log(this.tabs);
    this.selected = key;
  }
}
