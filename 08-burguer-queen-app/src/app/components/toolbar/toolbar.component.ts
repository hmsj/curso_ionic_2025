import { Component, inject } from '@angular/core';
import {
  IonBadge, IonButton,
  IonButtons,
  IonContent,
  IonHeader, IonIcon,
  IonImg, IonItem, IonLabel, IonList,
  IonMenu,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  MenuController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { arrowBackOutline, cartOutline, peopleOutline } from 'ionicons/icons';
import { UserOrderService } from '../../services/user-order/user-order.service';
import { ListProductsComponent } from '../list-products/list-products.component';
import { LoginComponent } from '../login/login.component';
import { Preferences } from '@capacitor/preferences';
import { KEY_TOKEN } from '../../constants';
import { ToastService } from '../../services/toast/toast.service';
import { CreateAccountComponent } from '../create-account/create-account.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonImg,
    RouterLink,
    IonMenu,
    IonContent,
    TranslatePipe,
    IonButtons,
    IonMenuButton,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonBadge,
    ListProductsComponent,
    IonButton,
    LoginComponent,
    CreateAccountComponent
  ]
})
export class ToolbarComponent  {

  private readonly userOrderService: UserOrderService = inject(UserOrderService);
  private readonly menuCtrl: MenuController = inject(MenuController);
  private readonly router: Router = inject(Router);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly translateService: TranslateService = inject(TranslateService);

  public numProductsSignal = this.userOrderService.numProductsSignal;
  public userSignal = this.userOrderService.userSignal;
  public showOrder: boolean = false;
  public showLogin: boolean = false;
  public showNewAccount: boolean = false;

  constructor() {
    addIcons({peopleOutline, cartOutline, arrowBackOutline})
  }

  public seeOrder() {
    this.showOrder = true;
  }

  public seeLogin() {
    this.showNewAccount = false;
    this.showLogin = true;
  }

  public seeNewAccount() {
    this.showLogin = false;
    this.showNewAccount = true;
  }

  public logout() {
    this.userOrderService.setUser(null);
    Preferences.remove({key: KEY_TOKEN});
    this.router.navigateByUrl('/categories');
    this.toastService.showToast(this.translateService.instant('label.logout.success'));
  }

  public back() {
    this.showOrder = false;
    this.showLogin = false;
    this.showNewAccount = false;
  }

  public goToPay() {
    this.back();
    this.menuCtrl.close('content')
    this.router.navigateByUrl('/pay')
  }
}
