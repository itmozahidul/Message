import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchengine',
  templateUrl: './searchengine.component.html',
  styleUrls: ['./searchengine.component.scss'],
})
export class SearchengineComponent implements OnInit {
  constructor(private router: Router) {}
  key: string = '';
  ngOnInit() {
    setTimeout(() => {
      let e = document.createElement('script');
      e.setAttribute(
        'src',
        'https://cse.google.com/cse.js?cx=52c59a049220f4617'
      );
      document.body.appendChild(e);
    }, 2000);
  }

  back() {
    this.router.navigate(['/chat']);
  }

  search() {}
}
