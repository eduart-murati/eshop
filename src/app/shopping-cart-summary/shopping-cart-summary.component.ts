import { Component, Input } from '@angular/core';
import { ShoppingCart } from '../models/shopping-cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-cart-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart-summary.component.html',
  styleUrl: './shopping-cart-summary.component.css'
})
export class ShoppingCartSummaryComponent {
  @Input('cart') cart: ShoppingCart | null | undefined;
}
