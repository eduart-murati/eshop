import { Product } from "./product";

export class ShoppingCartItem {

    key: string | any;
    title: string | any;
    imageUrl: string | any;
    price: number | any;
    category: string | any;
    quantity: number | any;

    // constructor(public product: Product, public quantity: number) { }
    constructor(init?: Partial<ShoppingCartItem>) {
        Object.assign(this, init);
    }

    get totalPrice() {
        return this.price * this.quantity;
    }
}