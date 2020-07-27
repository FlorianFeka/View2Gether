import { Component, OnInit } from '@angular/core';
import { v4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  public joinRoomId: String = '';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  createRoom() {
    const id: string = v4();
    this.router.navigate(['/room', id], { state: { data: { join: false } } });
  }
}
