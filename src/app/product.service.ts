import { Injectable } from '@angular/core';
import { DataSnapshot, Database, child, get, orderByChild, push, query, ref, remove, set, update } from '@angular/fire/database';
import { Observable, catchError, from, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: Database) { }

  create(product: any) {
    const productsRef = ref(this.db, '/products');
    const newProductRef = push(productsRef);
    set(newProductRef, product)
      .then(() => {
        console.log('Product added successfully');
      })
      .catch((error) => {
        console.error('Error adding product: ', error);
      });
  }

  getAll(): Observable<any[]> {
    const productsRef = ref(this.db, '/products');
    // Order products by 'title'
    const orderedProductsRef = query(productsRef, orderByChild('title'));

    return from(get(orderedProductsRef)).pipe(
      map(snapshot => {
        const products: any[] = [];
        snapshot.forEach(childSnapshot => {
          products.push({ key: childSnapshot.key, ...childSnapshot.val() });
        });
        return products;
      }),
      catchError(error => {
        return throwError(() => error); // throwError expects a factory function
      })
    );
  }

  get(productId: string): Observable<any> {
    const productRef = child(ref(this.db, '/products'), productId);

    return from(get(productRef)).pipe(
      map(snapshot => {
        if (snapshot.exists()) {
          return { key: snapshot.key, ...snapshot.val() };
        } else {
          throw new Error('Product not found');
        }
      }),
      catchError(error => {
        return throwError(() => error); // throwError expects a factory function
      })
    );
  }

  update(productId: string, product: any): Observable<void> {
    const productRef = ref(this.db, `/products/${productId}`);
    return from(update(productRef, product)).pipe(
      map(() => {
        console.log('Product updated successfully');
      }),
      catchError(error => {
        console.error('Error updating product: ', error);
        return throwError(() => error); // throwError expects a factory function
      })
    );
  }


  delete(productId: string): Observable<void> {
    const productRef = ref(this.db, `/products/${productId}`);
    return from(remove(productRef)).pipe(
      map(() => {
        console.log('Product deleted successfully');
      }),
      catchError(error => {
        console.error('Error deleting product: ', error);
        return throwError(() => error); // throwError expects a factory function
      })
    );
  }

}


// getAllProducts(): Observable<any[]> {
//   const productsRef = ref(this.db, '/products');
//   // Order products by 'title', also change the rule to the realtime database
//   const orderedProductsRef = query(productsRef, orderByChild('title'));

//   return new Observable<any[]>(observer => {
//     get(orderedProductsRef).then(snapshot => {
//       const products: any[] = [];
//       snapshot.forEach(childSnapshot => {
//         products.push({ key: childSnapshot.key, ...childSnapshot.val() });
//       });
//       observer.next(products);
//       observer.complete();
//     }).catch(error => {
//       observer.error(error);
//     });
//   });
// }