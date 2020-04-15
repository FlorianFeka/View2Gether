import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RoomComponent } from './room/room.component';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';

import { SocketService } from './services/socket.service'

const appRoutes: Routes = [
  { 
    path: 'room', 
    component: RoomComponent 
  },
  { 
    path: '', 
    component: LandingPageComponent,
    pathMatch: 'full'
  },
  { 
    path: '**', 
    redirectTo: ''
  }
];

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
