import { Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonCard, IonCardContent,
  IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonCheckbox,
  IonCol,
  IonContent, IonFab, IonFabButton,
  IonGrid, IonIcon,
  IonImg, IonItem, IonLabel, IonRadio, IonRadioGroup,
  IonRow, IonText
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { LoadingController, RadioGroupCustomEvent } from '@ionic/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ProductsService } from '../../services/products/products.service';
import { IProduct } from '../../models/product.model';
import { ImageUrlPipe } from '../../pipes/image-url/image-url.pipe';
import { addIcons } from 'ionicons';
import { addOutline, removeOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { IProductoExtraOption } from '../../models/producto-extra-option.model';
import { CalculateTotalPricePipe } from '../../pipes/calculate-total-price/calculate-total-price.pipe';
import { ToastService } from '../../services/toast/toast.service';
import { UserOrderService } from '../../services/user-order/user-order.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, IonGrid, IonRow, IonCol, IonCard, IonImg, ImageUrlPipe, IonCardHeader, TranslatePipe, IonCardTitle, IonCardSubtitle, IonItem, IonLabel, IonButton, IonIcon, IonText, IonCardContent, IonCheckbox, FormsModule, IonRadioGroup, IonRadio, CalculateTotalPricePipe, IonFab, IonFabButton]
})
export class ProductPage {

  @Input() idProduct!: string;

  private readonly router: Router = inject(Router);
  private readonly loadingCtrl: LoadingController = inject(LoadingController);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly productsService: ProductsService = inject(ProductsService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly userOrderService: UserOrderService = inject(UserOrderService);

  public productSignal: WritableSignal<IProduct | null> = signal(null);
  public quantitySignal: WritableSignal<number> = signal(1);

  constructor() {
    addIcons({removeOutline, addOutline})
  }

  ionViewWillEnter() {
    if(this.idProduct) {
      this.loadData();
    } else {
      this.router.navigate(['/categories']);
    }
  }

  private async loadData() {
    this.quantitySignal.set(1);
    const loading = await this.loadingCtrl.create({
      message: this.translateService.instant('label.loading')
    });
    loading.present();
    this.productsService.getProductById(this.idProduct).then((product: IProduct) => {
      this.productSignal.set(product);
    }).finally(() => loading.dismiss());
  }

  minusQuantity() {
    this.quantitySignal.update(quantity => quantity - 1);
  }

  addQuantity() {
    this.quantitySignal.update(quantity => quantity + 1);
  }

  changeMultipleOptions(event: RadioGroupCustomEvent, options: IProductoExtraOption[]) {
    options.forEach(op => op.selected = event.detail.value === op.name);
  }

  addProductOrder(product: IProduct) {
    this.userOrderService.addProduct(product, this.quantitySignal());
    console.log(this.userOrderService.productsSignal());
    console.log(this.userOrderService.numProductsSignal());
    console.log(this.userOrderService.totalOrderSignal());
    this.toastService.showToast(this.translateService.instant('label.product.add.success'));
    this.router.navigate(['categories']);
  }
}
