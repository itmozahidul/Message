import { asNativeElements, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { GeneralService } from './service/general.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router, private generalService: GeneralService) {}

  canActivate(): boolean {
    let ans = false;
    if (this.generalService.getToken()) {
      ans = !this.generalService.isTokenExpired();
    }
    if (!ans) {
      this.generalService.disConnect().then(
        (suc) => {
          this.router.navigateByUrl('login');
        },
        (err) => {
          console.log(err);
        }
      );
    }
    return ans;
  }
}
