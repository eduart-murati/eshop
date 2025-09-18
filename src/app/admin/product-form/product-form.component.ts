import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../category.service';
import { CommonModule, Location, NgFor } from '@angular/common';
import { FormsModule, AbstractControl, NgForm } from '@angular/forms'
import { ProductService } from '../../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { RestrictInputDirective } from '../../restrict-input.directive';
import { ProductCardComponent } from "../../product-card/product-card.component";

import { Category } from '../../models/category'; // Importoni modelin e kategorisë nëse është i nevojshëm

@Component({
  selector: 'app-product-form',
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
  imports: [
    CommonModule,
    NgFor,
    FormsModule,
    RestrictInputDirective,
    ProductCardComponent
  ]
})
export class ProductFormComponent implements OnInit {
  categories$: Observable<Category[]>; // Observable to fetch categories
  categories: Category[] = []; // Local property to store categories

  imageUrlPattern = '^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$';
  product: any = {};
  originalProduct: any = {};
  id: any;
  isChanged = false;

  isCategoryModalOpen = false; // To control modal visibility
  newCategoryName = '';        // To hold the new category name
  editingCategory?: Category; // For editing a category

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,    // perdorur?
    private productService: ProductService) {
    this.categories$ = categoryService.getAll(); // perdorur?
  

    this.id = this.route.snapshot.paramMap.get('id');
    // if (this.id) this.productService.get(this.id).pipe(take(1)).subscribe((p: any) => {this.product = p});
    if (this.id) this.productService.get(this.id).pipe(take(1)).subscribe((p: any) => {
      this.product = {...p};
      this.originalProduct = {...p}});  // shtuar per eventin Inputchange per aktivizimin e SAVE kur ka ndryshime
  }

  ngOnInit() {
    this.editingCategory = undefined; // Siguron që nuk jemi në modin e editimit
  }

  save(product: any) {
    // if (product.invalid ) return;
    if (this.id) this.productService.update(this.id, product);
    else this.productService.create(product); // console.log(product);
    this.router.navigate(['/admin/products']);
  }

  delete() {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(this.id);
    this.router.navigate(['/admin/products']);
  }

  imageUrlValidator(control: AbstractControl): { [key: string]: any } | null {
    const urlPattern = /^(https?:\/\/)?([a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5})(:[0-9]{1,5})?(\/.*)?$/i;
    if (control.value !== null && !urlPattern.test(control.value)) {
      return { 'invalidImageUrl': true };
    }
    return null;
  }

  onInputChange() {
    this.isChanged = JSON.stringify(this.product) !== JSON.stringify(this.originalProduct);
  }

  openAddCategory(): void {
    this.isCategoryModalOpen = true; // Hap modalin
    this.editingCategory = undefined; // Pastron kategorinë nëse ka ndonjë kategori që po redaktohet
  }

  addCategory() {
    if (this.newCategoryName.trim() !== '') {
      this.categoryService.create({ name: this.newCategoryName }).subscribe(() => {
        this.newCategoryName = ''; // Pastroni fushën e emrit të kategorisë pas shtimit
        this.isCategoryModalOpen = false; // Mbyllni modalin
      });
    }
  }

  editCategory(category: Category) {
    this.isCategoryModalOpen = true;
    this.editingCategory = { ...category }; // Krijon një kopje për editim
  }

  saveCategory() {
    if (this.editingCategory) {
      // Ensure you're getting the key correctly and passing it
      const categoryKey = this.editingCategory.key;
      const updatedCategory = { name: this.editingCategory.name };
  
      this.categoryService.update(categoryKey, updatedCategory).subscribe({
        next: () => {
          console.log('Category updated successfully');
          this.isCategoryModalOpen = false;
          this.editingCategory = undefined;
        },
        error: (error) => {
          console.error('Error updating category:', error);
        }
      });
    }
  }
  

  deleteCategory(categoryKey: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(categoryKey).subscribe(() => {
        // Opsionale: rifreskoni kategoritë ose tregoni një mesazh sukses
      });
    }
  }

  closeAddCategory() {
    this.isCategoryModalOpen = false;
    this.editingCategory = undefined;
  }

  goBack(): void {
    this.location.back();
  }

}

// save(product: any) {
//   if (product.invalid) return;

//   if (this.id) this.productService.update(this.id, product);
//   else this.productService.create(product); // console.log(product);
//   this.router.navigate(['/admin/products']);
// }

// nonNegativeNumberValidator(control: AbstractControl): { [key: string]: any } | null {
//   if (control.value !== null && (isNaN(control.value) || control.value < 0)) {
//     return { 'nonNegativeNumber': true };
//   }
//   return null;
// }

  
// deleteProduct(productId: string) {
//   this.productService.deleteProduct(productId).subscribe(
//     () => {
//       console.log('Product deleted');
//       // Optionally, refresh the products list or handle the UI update
//       this.products$ = this.productService.getAllProducts();
//     },
//     (error) => {
//       console.error('Error deleting product:', error);
//     }
//   );
// }