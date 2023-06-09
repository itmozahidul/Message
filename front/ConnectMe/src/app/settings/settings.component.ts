import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(private activatedroute: ActivatedRoute, private router: Router) {}

  ngOnInit() {}

  updateLocationsettings(event) {
    console.log(event);
    console.log(event.target.checked);
  }
}
