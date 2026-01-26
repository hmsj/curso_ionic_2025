import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ICreatePaymentIntent } from '../../models/create-payment-intent.model';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { IPayment } from '../../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class StripeService {

  private readonly URL_BASE = `${environment.urlServer}/stripe`;

  createPaymentIntent(paymentIntent: ICreatePaymentIntent) {
    return CapacitorHttp.post({url: `${this.URL_BASE}/intent`,data:{...paymentIntent}, params: {}, headers: {'Content-type': 'application/json', 'Authorization': `Bearer ${paymentIntent.secretKey}`}})
      .then((response: HttpResponse) => response.data as IPayment);
  }
}
