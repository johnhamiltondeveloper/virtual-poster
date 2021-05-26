import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import {AuthenticationModule} from './authentication/authentication.module';
import { CalendarComponent } from './calendar/calendar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptorService} from './auth-interceptor.service';
import { SettingComponent } from './setting/setting.component';
import { PresentationComponent } from './presentation/presentation.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ConferenceSetupComponent } from './conference-setup/conference-setup.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    CalendarComponent,
    PageNotFoundComponent,
    SettingComponent,
    PresentationComponent,
    ConferenceSetupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthenticationModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
