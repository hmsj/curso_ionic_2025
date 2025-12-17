import { Component, inject } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { CouponService } from '../../services/coupon/coupon.service';
import { Coupon, ICouponData } from '../../models/coupon.model';
import { FilterCouponCategoryPipe } from '../../pipes/filter-coupon-category/filter-coupon-category.pipe';
import { NgTemplateOutlet } from '@angular/common';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
import {
  CapacitorBarcodeScanner, CapacitorBarcodeScannerScanResult,
  CapacitorBarcodeScannerTypeHint
} from '@capacitor/barcode-scanner';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegmentButton,
    IonSegment,
    IonSegmentView,
    IonSegmentContent,
    IonLabel,
    FilterCouponCategoryPipe,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonImg,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    NgTemplateOutlet,
    IonItem,
    IonIcon
  ],
})
export class Tab1Page {

  private readonly couponService: CouponService = inject(CouponService);
  private readonly toastService: ToastService = inject(ToastService);

  public coupons: Coupon[] = [];

  constructor() {
    addIcons({ cameraOutline });
  }

  async ionViewWillEnter() {
    this.coupons = await this.couponService.getCoupons();
    console.log(this.coupons);
  }

  changeActive(coupon: Coupon) {
    coupon.active = !coupon.active;
    this.couponService.saveCoupons(this.coupons);
  }

  //https://www.the-qrcode-generator.com/
  startCamera() {
    CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.QR_CODE
    }).then((resultBarcode: CapacitorBarcodeScannerScanResult) => {
      console.log(resultBarcode);
      if(resultBarcode.ScanResult) {
        try {
          const couponData: ICouponData = JSON.parse(resultBarcode.ScanResult);
          const coupon = new Coupon(couponData);
          if(coupon.isValid()) {
            const couponExists = this.coupons.some((c: Coupon) => c.isEqual(coupon));
            if(!couponExists) {
              this.coupons = [...this.coupons, coupon];
              this.couponService.saveCoupons(this.coupons);
              this.toastService.showToast('Coupon saved!');
              console.log('Coupon saved:', coupon);
            } else {
              this.toastService.showToast('Coupon already exists!');
              console.warn('Coupon already exists:', coupon);
            }
          } else {
            this.toastService.showToast('Coupon data is invalid!');
            console.error('Coupon data is invalid:', couponData);
          }
        } catch(error: any) {
          this.toastService.showToast('Error parsing coupon data from QR code!');
          console.error('Error parsing coupon data from QR code:', error);
        }
      }
    })
  }
}
