import { NgModule } from '@angular/core';
import {
  NoPreloading,
  PreloadAllModules,
  RouterModule,
  Routes,
} from '@angular/router';
import { AuthenticationGuard } from './authentication.guard';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { MessageComponent } from './message/message.component';
import { NewFriendComponent } from './new-friend/new-friend.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { TextComponent } from './text/text.component';
import { WaitComponent } from './wait/wait.component';
import { SelectImageComponent } from './select-image/select-image.component';
import { SettingsComponent } from './settings/settings.component';
import { LocationComponent } from './location/location.component';
import { DynamicProfileComponent } from './dynamic-profile/dynamic-profile.component';
import { SearchengineComponent } from './searchengine/searchengine.component';
import { TestComponent } from './test/test.component';
import { CalldispComponent } from './calldisp/calldisp.component';

const routes: Routes = [
  /*  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  }, */
  { path: '', component: LoginComponent },
  /* {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }, */
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'chat/:friend',
    component: ChatComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'message/:chatid/:name',
    component: MessageComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'message',
    component: MessageComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'text',
    component: TextComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'dprofile/:user',
    component: DynamicProfileComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'newFriend',
    component: NewFriendComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'setting',
    component: SettingsComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'wait',
    component: WaitComponent,
  },
  {
    path: 'selectImage',
    component: SelectImageComponent,
  },
  {
    path: 'location',
    component: LocationComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'search',
    component: SearchengineComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'call/:user',
    component: TestComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'calldisp/:user',
    component: CalldispComponent,
    canActivate: [AuthenticationGuard],
  },
];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
