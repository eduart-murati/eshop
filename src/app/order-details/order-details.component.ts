import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../order.service';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {

  orderId: string | null = null;
  order: any | null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');

    if (this.orderId) {
      this.authService.user$.subscribe(user => {
        if (user) {
          this.orderService.getOrderById(this.orderId!).subscribe(order => {
            if (order?.userId === user.uid) {
              this.order = order;
            } else {
              console.error('Unauthorized access to order');
            }
          });
        }
      });
    }
  }

  get grandTotal(): number {
    return this.order.items.reduce((total: any, item: { totalPrice: any; }) => total + item.totalPrice, 0);
  }

  goBack(): void {
    this.location.back();
  }

}