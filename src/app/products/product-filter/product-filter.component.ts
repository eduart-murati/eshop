import { Component, Input } from '@angular/core';
import { CategoryService } from '../../category.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css'
})
export class ProductFilterComponent {
  categories$: any;
  @Input('category') category: any;

  constructor(
    categoryService: CategoryService
  ) {
    this.categories$ = categoryService.getAll();
  }

}
