import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Order } from '../models/order';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { OrderService } from '../order.service';
import { ShoppingCart } from '../models/shopping-cart';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-shipping-form',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './shipping-form.component.html',
  styleUrl: './shipping-form.component.css'
})

export class ShippingFormComponent implements OnInit, OnDestroy {
  @Input('cart') cart: ShoppingCart | undefined;
  shipping = {
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: ''
  };
  userId!: string | undefined;
  userSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService) { }

  async placeOrder() {  // (form: NgForm)
    // if (form.invalid) return;     // shtuar form: NgForm si datavalidation

    let order = new Order(this.userId, this.shipping, this.cart!)
    let result = await this.orderService.placeOrder(order);
    this.router.navigate(['/order-success', result.key]);
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(user => this.userId = user?.uid)
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
