import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GeneralService } from './service/general.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as appReducer from './store/reducer';
import { MessageComponent } from './message/message.component';
import { TokenInterceptorService } from './token-interceptor.service';
import { TextComponent } from './text/text.component';
import { NewFriendComponent } from './new-friend/new-friend.component';
import { ProfileComponent } from './profile/profile.component';
import { MenuComponent } from './menu/menu.component';
import { WaitComponent } from './wait/wait.component';
import { SelectImageComponent } from './select-image/select-image.component';
import { RecordAudioComponent } from './record-audio/record-audio.component';
import { Media } from '@awesome-cordova-plugins/media/ngx';
import { LocationComponent } from './location/location.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DisplayImageComponent } from './display-image/display-image.component';
import { DynamicProfileComponent } from './dynamic-profile/dynamic-profile.component';
//import { FileUploadOptions } from '@ionic-native/file-transfer/__ivy_ngcc__/ngx';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ChatComponent,
    MessageComponent,
    TextComponent,
    NewFriendComponent,
    ProfileComponent,
    DynamicProfileComponent,
    MenuComponent,
    WaitComponent,
    SelectImageComponent,
    RecordAudioComponent,
    LocationComponent,
    DisplayImageComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot(
      { app: appReducer.appReducer },
      {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
        },
      }
    ),
    ReactiveFormsModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([]),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    GeneralService,
    Media,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
