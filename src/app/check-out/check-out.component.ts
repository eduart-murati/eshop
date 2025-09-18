import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable, Subscription } from 'rxjs';
import { ShoppingCartSummaryComponent } from "../shopping-cart-summary/shopping-cart-summary.component";
import { ShippingFormComponent } from "../shipping-form/shipping-form.component";

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [CommonModule, ShoppingCartSummaryComponent, ShippingFormComponent],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css'
})
export class CheckOutComponent implements OnInit {
  cart$: Observable<ShoppingCart> | undefined;

  constructor(private shoppingcartSerice: ShoppingCartService) { }

  async ngOnInit() {
    this.cart$ = await this.shoppingcartSerice.getCart();
  }

}
