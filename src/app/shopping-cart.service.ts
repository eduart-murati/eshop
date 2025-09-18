import { Injectable } from '@angular/core';
import { Database, get, push, ref, set, update } from '@angular/fire/database';
import { Observable, BehaviorSubject, catchError, from, map, throwError, firstValueFrom } from 'rxjs';
import { Product } from './models/product';
import { ShoppingCart } from './models/shopping-cart';
import { remove } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})

export class ShoppingCartService {
  private cartSubject = new BehaviorSubject<ShoppingCart  | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private db: Database) {
    this.initializeCart();
   }

  public async initializeCart() {
    const cartObservable = await this.getCart();
    const cart = await firstValueFrom(cartObservable);
    this.cartSubject.next(cart);
  }

  async getCart(): Promise<Observable<ShoppingCart>> {
    const cartId = await this.getOrCreateCartId();
    const cartRef = ref(this.db, `shopping-carts/${cartId}`);
    return from(get(cartRef)).pipe(
      map(snapshot => new ShoppingCart(snapshot.val()?.items || {})),
      catchError(error => {
        console.error('Error fetching cart:', error);
        return throwError(() => error);
      })
    );
  }

  async addToCart(product: Product) {
    this.updateItem(product, 1)
  }

  async removeFromCart(product: Product) {
    this.updateItem(product, -1)
  }

  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    await remove(ref(this.db, `shopping-carts/${cartId}/items/`));
    await this.initializeCart();
  }
  
  private async createCart(): Promise<string> {
    try {
      const cartRef = ref(this.db, '/shopping-carts');
      const newCartRef = push(cartRef);
      const dateCreated = new Date().getTime();
      await set(newCartRef, { dateCreated });
      return newCartRef.key as string;
    }
    catch (error) {
      console.error("Error creating cart:", error);
      throw error;
    }
  }

  
  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    cartId = await this.createCart();
    localStorage.setItem('cartId', cartId);
    return cartId;
  }

  private getItem(cartId: string, productId: string) {
    return ref(this.db, `shopping-carts/${cartId}/items/${productId}`);
  }

  private async updateItem(product: Product, change: number) {
    try {
      const cartId = await this.getOrCreateCartId();
      let itemRef = this.getItem(cartId, product.key); // Assuming getItem returns a valid path or reference
      let itemSnapshot = await get(itemRef);
      let item = itemSnapshot.val(); // Extracts a value from a DataSnapshot.

      const quantity = (item?.quantity ?? 0) + change; 
      if (quantity === 0) await set(itemRef, null); // Removes the item
      else await update(itemRef, { 
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: quantity 
        }); // Nje metode per te shmangur If-in 

      this.initializeCart();
    }
    catch (error) {
      console.error('Error adding to cart:', error);
    }
  }
  
}



// const updatedQuantity = (item && item.quantity) ? item.quantity + 1 : 1;
// await update(itemRef, { product, quantity: updatedQuantity });
 

// async removeFromCart(product: Product) {
//   const cart = this.cartSubject.value;
//   const item = cart.items[product.key];
//   if (item) {
//     item.quantity -= 1;
//     if (item.quantity === 0) {
//       delete cart.items[product.key];
//     } else {
//       cart.items[product.key] = item;
//     }
//     this.cartSubject.next(cart);
//     await this.saveCartToStorageOrBackend(cart);
//   }
// }


