import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { Product } from '../models/product';
import { switchMap, Observable } from 'rxjs';
import { ProductFilterComponent } from "./product-filter/product-filter.component";
import { ProductCardComponent } from "../product-card/product-card.component";
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    ProductFilterComponent,
    ProductCardComponent
  ]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string | null | undefined;
  cart$: Observable<ShoppingCart | null> | undefined;
  imagesLoaded: number = 0;
  totalImages: number = 0;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService
  ) { }

  async ngOnInit(): Promise<void> {
    this.cart$ = this.shoppingCartService.cart$;
    this.populateProducts();
  }

  private populateProducts() {
    this.productService.getAll().pipe(
      switchMap((products: Product[]) => {
        this.products = products;
        return this.route.queryParamMap;
      })
    ).subscribe((params: ParamMap) => {
      this.category = params.get('category');
      this.applyFilter()
    });
  }

  private applyFilter() {
    this.filteredProducts = (this.category) ?
      this.products?.filter(p => p.category === this.category) :
      this.products;
  }

}


