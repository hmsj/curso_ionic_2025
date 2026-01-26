import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonRefresher,
  IonRefresherContent,
  IonRow,
} from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CategoriesService } from '../../services/categories/categories.service';
import { ICategory } from '../../models/category.model';
import { LoadingController } from '@ionic/angular';
import { ImageUrlPipe } from '../../pipes/image-url/image-url.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, TranslatePipe, IonRefresher, IonRefresherContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonImg, ImageUrlPipe]
})
export class CategoriesPage {

  private readonly categoriesService: CategoriesService = inject(CategoriesService);
  private readonly loadingCtrl: LoadingController = inject(LoadingController);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly router: Router = inject(Router);

  public categories: ICategory[] = [];

  constructor() { }

  ionViewWillEnter() {
    this.loadData();
  }

  private async loadData() {
    const loading = await this.loadingCtrl.create({
      message: this.translateService.instant('label.loading')
    });
    loading.present();
    this.categoriesService.getAllCategories().then((categories: ICategory[]) => {
      this.categories = categories;
    }).finally(() => loading.dismiss());

  }

  refreshCategories(event: CustomEvent) {
    this.loadData();
    (event.target as HTMLIonRefresherElement).complete();
  }

  goToProducts(category: ICategory) {
    this.router.navigate(['/products', category._id]);
  }

}
