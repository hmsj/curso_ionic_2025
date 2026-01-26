import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard, IonCardHeader, IonCardTitle,
  IonCol,
  IonContent, IonGrid, IonImg,
  IonRefresher,
  IonRefresherContent, IonRow,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products/products.service';
import { IProduct } from '../../models/product.model';
import { LoadingController } from '@ionic/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ImageUrlPipe } from '../../pipes/image-url/image-url.pipe';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonRefresher, IonRefresherContent, IonGrid, IonRow, IonCol, IonCard, IonImg, IonCardHeader, IonCardTitle, TranslatePipe, ImageUrlPipe]
})
export class ProductsPage {

  @Input() idCategory!: string;

  private readonly router: Router = inject(Router);
  private readonly loadingCtrl: LoadingController = inject(LoadingController);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly productsService: ProductsService = inject(ProductsService);

  public products: IProduct[] = [];

  async ionViewWillEnter() {
    if(this.idCategory) {
      this.loadData();
    } else {
      this.router.navigate(['/categories']);
    }
  }

  private async loadData() {
    const loading = await this.loadingCtrl.create({
      message: this.translateService.instant('label.loading')
    });
    this.productsService.getProductsByCategory(this.idCategory)
      .then((products: IProduct[]) => {
        this.products = products;
      }).finally(() => loading.dismiss());
  }

  refreshProducts(event: CustomEvent) {
    this.loadData();
    (event.target as HTMLIonRefresherElement).complete();
  }

  goToProduct(product: IProduct) {
    this.router.navigate(['/product', product._id]);
  }
}
