import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product';
import { ShoppingCartService } from '../shopping-cart.service';
import { ProductQuantityComponent } from "../product-quantity/product-quantity.component";
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  imports: [CommonModule, ProductQuantityComponent]
})

export class ProductCardComponent {

  @Input('product') product!: Product;
  @Input('show-actions') showActions = true;
  @Input('shopping-cart') shoppingCart: ShoppingCart | any;

  constructor(private cartService: ShoppingCartService) { }

  async addToCart() {
    if (this.product && this.product.key) {
      await this.cartService.addToCart(this.product);
    }
  }


}


