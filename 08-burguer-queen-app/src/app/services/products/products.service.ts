import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { IProduct } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  private readonly URL_BASE = `${environment.urlServer}/products`;

  public getProductsByCategory(idCategory: string) {
    return CapacitorHttp.get({url: `${this.URL_BASE}/category/${idCategory}`, params: {}, headers: {'Content-Type': 'application/json'}})
      .then((response: HttpResponse) => response.data as IProduct[]);
  }

  public getProductById(idProduct: string) {
    return CapacitorHttp.get({url: `${this.URL_BASE}/${idProduct}`, params: {}, headers: {'Content-Type': 'application/json'}})
      .then((response: HttpResponse) => response.data as IProduct);
  }
}
