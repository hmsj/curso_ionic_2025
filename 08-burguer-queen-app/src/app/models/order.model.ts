import { IUser } from './user.model';
import { IQuantityProduct } from './quantity-product.model';
import { computed, Signal, signal, WritableSignal } from '@angular/core';
import { IProduct } from './product.model';
import { calculateTotalPrice } from '../utils/calculate-total.util';

export interface IOrder {
  _id?: string;
  address?: string;
  user: IUser;
  products: IQuantityProduct[];
}

export class Order {

  private readonly _productsSignal: WritableSignal<IQuantityProduct[]>;
  private readonly _userSignal: WritableSignal<IUser | null>;
  private readonly _addressSignal: WritableSignal<string>;
  private readonly _numProductsSignal: Signal<number>;
  private readonly _totalOrderSignal: Signal<number>;

  constructor(products: IQuantityProduct[] = [], user: IUser | null = null, address: string = '') {
    this._productsSignal = signal(products);
    this._userSignal = signal(user);
    this._addressSignal = signal(address);
    this._numProductsSignal = computed(() => this.numProducts());
    this._totalOrderSignal = computed(() => this.totalOrder());
  }

  get productsSignal(): Signal<IQuantityProduct[]> {
    return this._productsSignal.asReadonly();
  }

  get userSignal(): Signal<IUser | null> {
    return this._userSignal.asReadonly();
  }

  get addressSignal(): Signal<string> {
    return this._addressSignal.asReadonly();
  }

  get numProductsSignal(): Signal<number> {
    return this._numProductsSignal;
  }

  get totalOrderSignal(): Signal<number> {
    return this._totalOrderSignal;
  }

  public addProduct(product: IProduct, quantity: number = 1): void {
    const products = this._productsSignal();
    const productFound = this.searchProduct(product);
    if(productFound) {
      productFound.quantity += quantity;
    } else {
      products.push({product, quantity});
    }
    this._productsSignal.set([...products]);
  }

  public oneMoreProduct(product: IProduct): void {
    const productFound = this.searchProduct(product);
    if(productFound) {
      productFound.quantity++;
      this._productsSignal.set([...this._productsSignal()]);
    }
  }

  public oneLessProduct(product: IProduct): void {
    const productFound = this.searchProduct(product);
    if(productFound) {
      productFound.quantity--;
      if(productFound.quantity === 0) {
        this.removeProduct(product);
      } else {
        this._productsSignal.set([...this._productsSignal()]);
      }
    }
  }

  public resetOrder(): void {
    this._productsSignal.set([]);
    this._addressSignal.set('');
  }

  public setUser(user: IUser | null): void {
    this._userSignal.set(user);
  }

  public setAddress(address: string): void {
    this._addressSignal.set(address);
  }

  private removeProduct(product: IProduct) {
    this._productsSignal.update((products: IQuantityProduct[]) => products.filter((quantityProduct: IQuantityProduct) => JSON.stringify(quantityProduct.product) !== JSON.stringify(product)));
  }

  private searchProduct(product: IProduct): IQuantityProduct | undefined {
    return this._productsSignal().find((quantityProduct: IQuantityProduct) => JSON.stringify(quantityProduct.product) === JSON.stringify(product));
  }

  private numProducts(): number {
    return this._productsSignal().reduce((sum: number, value: IQuantityProduct) => sum + value.quantity, 0);
  }

  private totalOrder(): number {
    return this._productsSignal().reduce((sum: number, value: IQuantityProduct) => sum + calculateTotalPrice(value.product, value.quantity), 0);
  }
}