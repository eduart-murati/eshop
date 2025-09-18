import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppUser } from '../models/app-user';
import { ShoppingCartService } from '../shopping-cart.service';
import { Observable, Subscription } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'bs-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './bs-navbar.component.html',
  styleUrl: './bs-navbar.component.css'
})

export class BsNavbarComponent implements OnInit {
  appUser: AppUser | undefined | null;
  cart$: Observable<ShoppingCart | null> | undefined;
  subscription: Subscription | undefined;

  constructor(
    public auth: AuthService,
    private shoppingCartService: ShoppingCartService
  ) { }


  async ngOnInit(): Promise<void> {
    this.auth.appUser$.subscribe(appUser => this.appUser = appUser);
    this.cart$ = this.shoppingCartService.cart$;
  }


  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }


  logout() {
    this.auth.logout();
  }

}



// async ngOnInit(): Promise<void> {
//   this.auth.appUser$.subscribe(appUser => this.appUser = appUser);
//   this.cart$ = this.shoppingCartService.cart$;

//   //method a) works
//   // const cartObservable = await this.shoppingCartService.getCart();
//   // this.subscription = cartObservable.subscribe(cart => this.cart$ = this.shoppingCartService.cart$);

//   //method b) works
//   // this.subscription = (await this.shoppingCartService.getCart()).subscribe(cart => {
//   //   if (cart) {
//   //     this.cart$ = this.shoppingCartService.cart$;
//   //   }
//   // });

// }