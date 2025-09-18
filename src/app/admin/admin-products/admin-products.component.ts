import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../product.service';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnDestroy, AfterViewInit {
  // products$;
  products: Product[] | undefined; //  products: { title: string }[] | undefined;  // filteredProducts: any[] | undefined;
  subscription: Subscription | undefined;

  displayedColumns: string[] = ['nr', 'title', 'price', 'edit'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  totalRecords: number = 0;
  pageSizeOptions: number[] = [5, 10, 25];

  constructor(private productService: ProductService) {
    // this.products$ = this.productService.getAll();
    this.subscription = this.productService.getAll()
      .subscribe(products => {
        this.products = products  //this.filteredProducts = this.products = products
        this.initializeTable(products);
      });
  }

  private initializeTable(products: Product[]) {
    this.dataSource.data = products;
    this.totalRecords = products.length;
    this.updatePageSizeOptions();

    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      // console.log('Setting sort:', this.sort); // Debug log
      this.dataSource.sort = this.sort;
    }
  }

  updatePageSizeOptions() {
    const defaultOptions = [5, 10, 25];

    if (this.totalRecords > 25) {
      // Set default options and add the maximum record count as the last option
      this.pageSizeOptions = [...defaultOptions, this.totalRecords];
    } else {
      // Filter options less than totalRecords and add totalRecords as the last option
      this.pageSizeOptions = [...defaultOptions.filter(option => option <= this.totalRecords), this.totalRecords];
    }
  }

  filter(query: string) {
    // //for Simple table
    // let filteredProducts = (query) ? this.products?.filter(p => p.title.toLowerCase().includes(query.toLocaleLowerCase())) : this.products;

    //for Angular Material table
    this.dataSource.filter = query.trim().toLowerCase();  // console.log(query);
    // this.initializeTable(filteredProducts!);
  }

  clearSearch(queryInput: HTMLInputElement) {
    queryInput.value = ''; // Reset the search query
    this.dataSource.filter = '';  //  ose  // this.initializeTable(this.products!);
    // this.filteredProducts = this.products;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}



// <table class="table">
//     <thead>
//         <tr>
//             <th>Title</th>
//             <th>Price</th>
//             <th></th>
//         </tr>
//     </thead>
//     <tbody>
//         <tr *ngFor="let p of filteredProducts"> <!-- of products$ | async-->
//             <td>{{p.title}}</td>
//             <td>{{p.price}} </td>
//             <td>
//                 <button class="btn btn-outline-secondary btn-edit"
//                     [routerLink]="['/admin/products', p.key]">Edit</button>
//             </td>
//         </tr>
//     </tbody>
// </table>