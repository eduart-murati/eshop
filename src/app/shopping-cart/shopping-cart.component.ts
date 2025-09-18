import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { Observable } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';
import { CommonModule } from '@angular/common';
import { ProductQuantityComponent } from "../product-quantity/product-quantity.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
  imports: [CommonModule, RouterModule, ProductQuantityComponent]
})
export class ShoppingCartComponent implements OnInit {

  cart$: Observable<ShoppingCart | null> | undefined;

  constructor(private shoppingCartService: ShoppingCartService) { }

  async ngOnInit() {
    this.cart$ = this.shoppingCartService.cart$;
  }

  clearCart() {
    this.shoppingCartService.clearCart();
  }


}
