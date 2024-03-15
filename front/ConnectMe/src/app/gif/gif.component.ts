import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GeneralService } from '../service/general.service';
import { Gifformat } from '../DTO/Gifformat';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../store/reducer';
import * as selector from '../store/selector';
import * as action from '../store/action';

@Component({
  selector: 'app-gif',
  templateUrl: './gif.component.html',
  styleUrls: ['./gif.component.scss'],
})
export class GifComponent implements OnInit {
  gifs: Gifformat[] = [];
  gifs$: Observable<Gifformat[]>;
  @Output() onGifinput = new EventEmitter<any>();
  constructor(
    private generalService: GeneralService,
    private store: Store<State>
  ) {
    this.gifs$ = this.store.select(selector.selectGifs);
  }

  ngOnInit() {
    this.search(null, 'happy');
    this.gifs$.subscribe(
      (s) => {
        this.gifs = s;
      },
      (er) => {
        this.gifs = [];
      }
    );
  }

  send(data) {
    console.log(data);
    this.onGifinput.emit(data);
  }

  search(e, v) {
    console.log(v);
    this.generalService.getGifs(v).subscribe(
      (d) => {
        console.log('success');
        this.store.dispatch(action.updateGifs({ gifs: d }));
      },
      (err) => {
        console.log(err);
      }
    );
    console.log(this.gifs.length);
  }
}
