import { Component, Input } from '@angular/core';
import { Product } from '../models/product';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-product-quantity',
  standalone: true,
  imports: [],
  templateUrl: './product-quantity.component.html',
  styleUrl: './product-quantity.component.css'
})
export class ProductQuantityComponent {
  @Input('product') product!: Product;
  @Input('shopping-cart') shoppingCart: ShoppingCart | any;

  constructor(private cartService: ShoppingCartService) { }

  async addToCart() {
    if (this.product && this.product.key) {
      await this.cartService.addToCart(this.product);
    }
  }

  async removeFromCart() {
    if (this.product && this.product.key) {
      await this.cartService.removeFromCart(this.product);
    }
  }

}
