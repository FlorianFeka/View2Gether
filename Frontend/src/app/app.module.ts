import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RoomComponent } from './room/room.component';
import { SocketService } from './services/socket.service';

const appRoutes: Routes = [
  {
    path: 'room/:id',
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
  declarations: [AppComponent, RoomComponent, LandingPageComponent],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule {}
