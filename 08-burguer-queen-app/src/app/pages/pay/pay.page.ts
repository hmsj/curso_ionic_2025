import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonRadio,
  IonRadioGroup,
  IonRow
} from '@ionic/angular/standalone';
import { UserOrderService } from '../../services/user-order/user-order.service';
import { LoginComponent } from '../../components/login/login.component';
import { Router } from '@angular/router';
import { CreateAccountComponent } from '../../components/create-account/create-account.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ListProductsComponent } from '../../components/list-products/list-products.component';
import { FormsModule } from '@angular/forms';
import { PaymentSheetEventsEnum, PaymentSheetResultInterface, Stripe } from '@capacitor-community/stripe';
import { environment } from '../../../environments/environment';
import { ICreatePaymentIntent } from '../../models/create-payment-intent.model';
import { StripeService } from '../../services/stripe/stripe.service';
import { IPayment } from '../../models/payment.model';
import { ToastService } from '../../services/toast/toast.service';
import { OrdersService } from '../../services/orders/orders.service';
import { IOrder } from '../../models/order.model';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
  standalone: true,
  imports: [IonContent, IonGrid, IonRow, IonCol, LoginComponent, CreateAccountComponent, IonCard, IonCardHeader, IonCardTitle, TranslatePipe, IonCardContent, IonButton, IonItem, ListProductsComponent, IonRadioGroup, IonRadio, IonInput, FormsModule]
})
export class PayPage {

  private readonly userOrderService: UserOrderService = inject(UserOrderService);
  private readonly router: Router = inject(Router);
  private readonly stripeService: StripeService = inject(StripeService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly ordersService: OrdersService = inject(OrdersService);

  public userSignal = this.userOrderService.userSignal;
  public numProductsSignal = this.userOrderService.numProductsSignal;
  public totalOrderSignal = this.userOrderService.totalOrderSignal;

  public showCreateAccount: boolean = false;
  public step: number = 1;
  public address: string = '';
  public showNewAddress: boolean = false;

  ionViewWillEnter() {
    this.setAddressDefault();
    Stripe.initialize({publishableKey: environment.stripe.publishKey});
  }

  public backHome() {
    this.router.navigate(['/categories']);
  }

  public newAccount() {
    this.showCreateAccount = true;
  }

  public seeLogin() {
    this.showCreateAccount = false;
  }

  public nextStep() {
    this.step++;
  }

  public previousStep() {
    this.step--;
  }

  setAddressDefault() {
    this.address = this.userSignal() ? this.userSignal()!.address! : '';
    this.showNewAddress = false;
  }

  changeOptionAddress(event: Event) {
    const target = event.target as HTMLInputElement;
    switch(target.value) {
      case 'address-default':
        this.setAddressDefault();
        break;
      case 'choose-address':
        this.address = '';
        this.showNewAddress = true;
        break;
    }
  }

  payWithStripe() {
    const total = this.totalOrderSignal() * 100;
    const paymmentIntent: ICreatePaymentIntent = {
      secretKey: environment.stripe.secretKey,
      amount: +total.toFixed(0),
      currency: 'EUR',
      customer_id: environment.stripe.customerId
    }
    this.stripeService.createPaymentIntent(paymmentIntent).then(async (paymentIntent: IPayment) => {
      await Stripe.createPaymentSheet({
        paymentIntentClientSecret: paymentIntent.paymentIntentClientSecret,
        customerEphemeralKeySecret: paymentIntent.ephemeralKey,
        customerId: paymentIntent.customer,
        merchantDisplayName: 'Burguer Queen',
      })
      Stripe.presentPaymentSheet().then((result: {paymentResult: PaymentSheetResultInterface}) => {
        if(result.paymentResult === PaymentSheetEventsEnum.Completed) {
          this.createOrder();
        } else if(result.paymentResult === PaymentSheetEventsEnum.Failed) {
          this.toastService.showToast(this.translateService.instant('label.pay.fail'));
        }
      });
    }).catch(error => {
      console.log(error);
    })
  }

  private createOrder() {
    this.userOrderService.setAddress(this.address);
    const order = this.userOrderService.getOrder();
    this.ordersService.createOrder(order)
      .then((order: IOrder) => {
        this.toastService.showToast(this.translateService.instant('label.pay.success', {address: this.address}));
        this.userOrderService.resetOrder();
        this.router.navigate(['/categories']);
      })
      .catch(() => {
        this.toastService.showToast(this.translateService.instant('label.pay.fail'));
      })
  }
}
