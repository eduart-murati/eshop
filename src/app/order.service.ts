import { Injectable } from '@angular/core';
import { Database, equalTo, get, orderByChild, push, query, ref, runTransaction, set, update } from '@angular/fire/database';
import { Order } from './models/order';
import { ShoppingCartService } from './shopping-cart.service';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: Database, private shoppingCartService: ShoppingCartService) { }

  async placeOrder(order: Order): Promise<{ key: string }> {
    const ordersRef = ref(this.db, '/orders');
    const newOrderRef = push(ordersRef);
    await set(newOrderRef, order);

    this.shoppingCartService.clearCart();

    return { key: newOrderRef.key as string };

  }

  getOrders(): Observable<any[]> {
    const ordersRef = ref(this.db, '/orders');
    return from(get(ordersRef)).pipe(
      map(snapshot => {
        const data = snapshot.exists() ? snapshot.val() : {};
        // Convert data object to an array
        return Object.keys(data).map(key => ({ key, ...data[key] }));
      }),
      catchError(error => {
        console.error('Error fetching orders:', error);
        return of([]);  // Return an empty array in case of an error
      })
    );
  }

  getOrdersByUser(userId: string): Observable<any[]> {
    const ordersRef = ref(this.db, '/orders');
    const ordersQuery = query(ordersRef, orderByChild('userId'), equalTo(userId));
    return from(get(ordersQuery)).pipe(
      map(snapshot => {
        const data = snapshot.exists() ? snapshot.val() : {};
        // // console.log('Raw data:', data);  // Debug log
        // Convert data object to an array
        return Object.keys(data).map(key => ({ key, ...data[key] }));
      }),
      catchError(error => {
        console.error('Error fetching user orders:', error);
        return of([]);  // Return an empty array in case of an error
      })
    );
  }

  getOrderById(orderId: string): Observable<any> {
    const orderRef = ref(this.db, `/orders/${orderId}`);
    return from(get(orderRef)).pipe(
      map(snapshot => snapshot.exists() ? snapshot.val() : null),
      catchError(error => {
        console.error('Error fetching order:', error);
        return of(null);
      })
    );
  }


}


//   getAll(): Observable<any[]> {
//     const productsRef = ref(this.db, '/products');
//     // Order products by 'title'
//     const orderedProductsRef = query(productsRef, orderByChild('title'));

//     return from(get(orderedProductsRef)).pipe(
//       map(snapshot => {
//         const products: any[] = [];
//         snapshot.forEach(childSnapshot => {
//           products.push({ key: childSnapshot.key, ...childSnapshot.val() });
//         });
//         return products;
//       }),
//       catchError(error => {
//         return throwError(() => error); // throwError expects a factory function
//       })
//     );
//   }

// }




// export class OrderService {

//   constructor(private db: Database, private shoppingCartService: ShoppingCartService) { }

//   async placeOrder(order: Order): Promise<{ key: string }> {
//     const ordersRef = ref(this.db, '/orders');
//     const newOrderRef = push(ordersRef);

//     await runTransaction(ref(this.db, '/shopping-carts'), async (shoppingCartSnapshot) => {
//       if (shoppingCartSnapshot.exists()) {
//         await set(newOrderRef, order);
//         await this.shoppingCartService.clearCart();
//         return shoppingCartSnapshot;
//       } else {
//         throw new Error('Cart is empty, cannot place order.');
//       }
//     });

//     return { key: newOrderRef.key as string };

//   }
// }