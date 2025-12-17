import { Injectable } from '@angular/core';
import { Coupon, ICouponData } from '../../models/coupon.model';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class CouponService {

  private readonly KEY_COUPONS: string = 'ddr_key_coupons';

  async getCoupons() {

    const couponsData: ICouponData[] | null = await this.recoverCoupons();

    if(couponsData) return this.processCoupons(couponsData);

    return fetch('./assets/data/coupons.json')
      .then(async (response: Response) => {
        const couponsData: ICouponData[] = await response.json();
        const coupons: Coupon[] = this.processCoupons(couponsData);
        coupons.forEach(coupon => coupon.active = false);
        return coupons;
      }).catch(() => []);
  }

  private processCoupons(couponsData: ICouponData[]) {
    const coupons: Coupon[] = [];
    for(const couponData of couponsData) {
      coupons.push(new Coupon(couponData));
    }
    return coupons;
  }

  saveCoupons(coupons: Coupon[]) {
    const couponsData: ICouponData[] = coupons.map((coupon: Coupon) => coupon.toCouponData());
    Preferences.set({
      key: this.KEY_COUPONS,
      value: JSON.stringify(couponsData)
    });
  }

  private async recoverCoupons() {
    const couponsPreferences = await Preferences.get({key: this.KEY_COUPONS});
    if(couponsPreferences.value) return JSON.parse(couponsPreferences.value) as ICouponData[];
    return null;
  }
}
