// import { provideRouter } from "@angular/router";
// import routeConfig from './app/routes';

import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ProductsComponent } from "./products/products.component";
import { ShoppingCartComponent } from "./shopping-cart/shopping-cart.component";
import { CheckOutComponent } from "./check-out/check-out.component";
import { OrderSuccessComponent } from "./order-success/order-success.component";
import { LoginComponent } from "./login/login.component";
import { AdminProductsComponent } from "./admin/admin-products/admin-products.component";
import { AdminOrdersComponent } from "./admin/admin-orders/admin-orders.component";
import { MyOrdersComponent } from "./my-orders/my-orders.component";
import { AuthGuardService } from './auth-guard.service';
import { AdminAuthGuardService } from "./admin-auth-guard.service";
import { ProductFormComponent } from "./admin/product-form/product-form.component";
import { OrderDetailsComponent } from "./order-details/order-details.component";

const routeConfig: Routes = [
    { path: '', component: ProductsComponent, title: 'Home page' },  // HomeComponent
    { path: 'products', component: ProductsComponent, title: 'Products' },
    { path: 'shopping-cart', component: ShoppingCartComponent, title: 'Shopping Cart' },
    { path: 'login', component: LoginComponent, title: 'Login' },

    { path: 'check-out', component: CheckOutComponent, title: 'Check Out', canActivate: [AuthGuardService] },
    { path: 'order-success/:id', component: OrderSuccessComponent, title: 'Order', canActivate: [AuthGuardService] },
    { path: 'my-orders', component: MyOrdersComponent, title: 'My Orders', canActivate: [AuthGuardService] },
    { path: 'my-orders/:id', component: OrderDetailsComponent, title: 'My Order ID', canActivate: [AuthGuardService] },
    {
        path: 'admin/products/new',
        component: ProductFormComponent,
        title: 'Admin Products Form ',
        canActivate: [AuthGuardService, AdminAuthGuardService]
    },
    {
        path: 'admin/products/:id',
        component: ProductFormComponent,
        title: 'Admin Products Form ',
        canActivate: [AuthGuardService, AdminAuthGuardService]
    },
    {
        path: 'admin/products',
        component: AdminProductsComponent,
        title: 'Admin Products',
        canActivate: [AuthGuardService, AdminAuthGuardService]
    },
    {
        path: 'admin/orders',
        component: AdminOrdersComponent,
        title: 'Admin Orders',
        canActivate: [AuthGuardService, AdminAuthGuardService]
    },
    {
        path: 'admin/orders/:id',
        component: OrderDetailsComponent,
        title: 'Admin Orders',
        canActivate: [AuthGuardService, AdminAuthGuardService]
    },
];

export default routeConfig;