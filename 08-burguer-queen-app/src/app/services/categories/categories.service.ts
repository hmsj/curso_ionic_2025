import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { ICategory } from '../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {

  private readonly URL_BASE = `${environment.urlServer}/categories`;

  public getAllCategories() {
    return CapacitorHttp.get({
      url: this.URL_BASE,
      params: {},
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response: HttpResponse) => response.data as ICategory[]);
  }
}
