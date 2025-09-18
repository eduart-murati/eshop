import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { OrderService } from '../order.service';
import { of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent {

  constructor(private authService: AuthService, private orderService: OrderService) { }

  orders$ = this.authService.user$.pipe(
    switchMap(user => {
      if (user?.uid) {
        return this.orderService.getOrdersByUser(user.uid);
      } else {
        return of([]);  // Return an empty array if no user ID
      }
    })
  );


}
