import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsNavbarComponent } from "./bs-navbar/bs-navbar.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    CommonModule,
    RouterModule,
    BsNavbarComponent
  ]
})
export class AppComponent {
  title = 'eshop';
}
