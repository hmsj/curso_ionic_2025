import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid, IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow, IonText
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { UserOrderService } from '../../services/user-order/user-order.service';
import { ExtrasSelectedPipe } from '../../pipes/extras-selected/extras-selected.pipe';
import { addIcons } from 'ionicons';
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { CalculateTotalPricePipe } from '../../pipes/calculate-total-price/calculate-total-price.pipe';
import { IQuantityProduct } from '../../models/quantity-product.model';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    TranslatePipe,
    IonList,
    ExtrasSelectedPipe,
    IonCard,
    IonCardContent,
    IonIcon,
    IonText,
    CalculateTotalPricePipe,
    IonButton
  ]
})
export class ListProductsComponent {

  @Input() showButtonPay: boolean = true;

  @Output() pay: EventEmitter<void> = new EventEmitter();

  private readonly userOrderService: UserOrderService = inject(UserOrderService);
  private readonly alertService: AlertService = inject(AlertService);

  public totalOrderSignal = this.userOrderService.totalOrderSignal;
  public productsSignal = this.userOrderService.productsSignal;

  constructor() {
    addIcons({removeCircleOutline, addCircleOutline});
  }

  public oneLessProduct(quantityProduct: IQuantityProduct) {
    if(quantityProduct.quantity === 1) {
      this.alertService.alertConfirm(
        'Confimación',
        '¿Quieres eliminar este producto del pedido?',
        () => this.userOrderService.oneLessProduct(quantityProduct.product)
      )
    } else {
      this.userOrderService.oneLessProduct(quantityProduct.product);
    }
  }

  public oneMoreProduct(quantityProduct: IQuantityProduct) {
    this.userOrderService.oneMoreProduct(quantityProduct.product);
  }

  public clickPay() {
    this.pay.emit();
  }

}
