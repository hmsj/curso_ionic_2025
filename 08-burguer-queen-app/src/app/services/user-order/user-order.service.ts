import { Injectable, Signal } from '@angular/core';
import { IOrder, Order } from '../../models/order.model';
import { IQuantityProduct } from '../../models/quantity-product.model';
import { IUser } from '../../models/user.model';
import { Preferences } from '@capacitor/preferences';
import { IProduct } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class UserOrderService {

  private order!: Order;

  private readonly KEY_ORDER = 'ddr_key_order';

  public productsSignal!: Signal<IQuantityProduct[]>;
  public userSignal!: Signal<IUser | null>;
  public addressSignal!: Signal<string>;
  public numProductsSignal!: Signal<number>;
  public totalOrderSignal!: Signal<number>;

  async initOrder() {
    const orderPreferences = await Preferences.get({key: this.KEY_ORDER});
    if(orderPreferences.value) {
      const order = JSON.parse(orderPreferences.value) as IOrder;
      this.order = new Order(order.products, order.user, order.address);
    } else {
      this.order = new Order();
    }

    this.productsSignal = this.order.productsSignal;
    this.userSignal = this.order.userSignal;
    this.addressSignal = this.order.addressSignal;
    this.numProductsSignal = this.order.numProductsSignal;
    this.totalOrderSignal = this.order.totalOrderSignal;

    if(!orderPreferences.value) {
      this.saveOrder();
    }
  }

  async saveOrder() {
    const order: IOrder = this.getOrder();
    await Preferences.set({key: this.KEY_ORDER, value: JSON.stringify(order)});
  }

  public getOrder(): IOrder {
    return {
      products: this.productsSignal(),
      user: this.userSignal(),
      address: this.addressSignal()
    } as IOrder;
  }

  public addProduct(product: IProduct, quantity: number = 1) {
    this.order.addProduct(product, quantity);
    this.saveOrder();
  }

  public oneMoreProduct(product: IProduct) {
    this.order.oneMoreProduct(product);
    this.saveOrder();
  }

  public oneLessProduct(product: IProduct) {
    this.order.oneLessProduct(product);
    this.saveOrder();
  }

  public resetOrder() {
    this.order.resetOrder();
    this.saveOrder();
  }

  public setUser(user: IUser | null) {
    this.order.setUser(user);
    this.saveOrder();
  }

  public setAddress(address: string) {
    this.order.setAddress(address);
    this.saveOrder();
  }
}
