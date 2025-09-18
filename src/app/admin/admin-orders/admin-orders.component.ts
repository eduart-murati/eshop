import { Component } from '@angular/core';
import { OrderService } from '../../order.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent {
  orders$: any;

  constructor(private orderService: OrderService) {
    this.orders$ = orderService.getOrders();
  }
}
