import { Injectable } from '@angular/core';
import { Database, get, ref, query, orderByChild, push, set, update, remove, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private db: Database) { }

  getAll(): Observable<any[]> {
    const categoriesRef = ref(this.db, '/categories');
    // Order categories by 'name'
    const orderedCategoriesRef = query(categoriesRef, orderByChild('name'));

    return new Observable<any[]>(observer => {
      const unsubscribe = onValue(orderedCategoriesRef, snapshot => {
        const categories: any[] = [];
        snapshot.forEach(childSnapshot => {
          categories.push({ key: childSnapshot.key, ...childSnapshot.val() });
        });
        observer.next(categories);
      }, error => {
        observer.error(error);
      });

      // Return the unsubscribe function to stop listening when no longer needed
      return () => unsubscribe();
    });
  }

  // getAll(): Observable<any[]> {
  //   const categoriesRef = ref(this.db, '/categories');
  //   // Order categories by 'name', also change the rule to the realtime database
  //   const orderedCategoriesRef = query(categoriesRef, orderByChild('name'));

  //   return new Observable<any[]>(observer => {
  //     get(orderedCategoriesRef).then(snapshot => {
  //       const categories: any[] = [];
  //       snapshot.forEach(childSnapshot => {
  //         categories.push({ key: childSnapshot.key, ...childSnapshot.val() });
  //       });
  //       observer.next(categories);
  //       observer.complete();
  //     }).catch(error => {
  //       observer.error(error);
  //     });
  //   });
  // }

  // Shto një kategori të re (ekzistuese)
  create(category: { name: string }): Observable<void> {
    const sanitizedKey = this.sanitizeKey(category.name);
    const categoryRef = ref(this.db, `/categories/${sanitizedKey}`);
    return new Observable<void>(observer => {
      set(categoryRef, category)
        .then(() => observer.next())
        .catch(error => observer.error(error));
    });
  }

  // Përditëso një kategori ekzistuese
  update(categoryKey: string, updatedCategory: { name: string }): Observable<void> {
    const categoryRef = ref(this.db, `/categories/${categoryKey}`);
    return new Observable<void>(observer => {
      update(categoryRef, updatedCategory)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  // Fshi një kategori
  delete(categoryKey: string): Observable<void> {
    const categoryRef = ref(this.db, `/categories/${categoryKey}`);
    return new Observable<void>(observer => {
      remove(categoryRef)
        .then(() => observer.next())
        .catch(error => observer.error(error));
    });
  }

  // Sanitizimi i çelësave
  private sanitizeKey(key: string): string {
    return key.replace(/[\.\#\$\[\]\/]/g, '-').toLowerCase();
  }

  // Kjo metode krijon Kategori me ID pasi perdor metoden push
  // create(category: { name: string }): Promise<void> {
  //   const categoriesRef = ref(this.db, '/categories');
  //   return push(categoriesRef, category)
  //     .then(() => console.log('Category added successfully'))
  //     .catch(error => {
  //       console.error('Error adding category:', error);
  //       throw error;
  //     });
  // }

}

