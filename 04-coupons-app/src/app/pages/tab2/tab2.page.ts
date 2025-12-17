import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText, Platform
} from '@ionic/angular/standalone';
import { QRCodeComponent } from 'angularx-qrcode';
import { CouponService } from '../../services/coupon/coupon.service';
import { GetBrightnessReturnValue, ScreenBrightness } from '@capacitor-community/screen-brightness';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    QRCodeComponent,
    IonGrid,
    IonRow,
    IonCol,
    IonText
  ]
})
export class Tab2Page {

  public QRCode!: string;
  private readonly couponService: CouponService = inject(CouponService);
  private currentBrightness!: GetBrightnessReturnValue;
  private readonly platform = inject(Platform);

  async ionViewWillEnter() {

    if(!this.platform.is('desktop')) {
      this.currentBrightness = await ScreenBrightness.getBrightness();
      this.setMaxBrightness()
      if(this.platform.is('ios')) {
        App.addListener('appStateChange', (state) => {
          if(state.isActive) {
            this.setMaxBrightness()
          } else {
            this.restoreBrightness();
          }
        })
      }
    }

    const coupons = await this.couponService.getCoupons();
    const couponsActive = coupons.filter(coupon => coupon.active);
    if(couponsActive.length > 0) {
      this.QRCode = JSON.stringify(couponsActive);
    } else {
      this.QRCode = '';
    }
  }

  setMaxBrightness() {
    ScreenBrightness.setBrightness({brightness: 1});
  }

  restoreBrightness() {
    ScreenBrightness.setBrightness({brightness: this.currentBrightness.brightness});
  }

  ionViewDidLeave() {
    if(!this.platform.is('desktop')) {
      this.restoreBrightness();
      App.removeAllListeners();
    }
  }

}
