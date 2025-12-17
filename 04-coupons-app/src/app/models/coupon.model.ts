export interface ICouponData {
  idProduct: string;
  img: string;
  name: string;
  category: string;
  discount: number;
  active?: boolean;
}

export class Coupon {
  private _idProduct!: string;
  private _img!: string;
  private _name!: string;
  private _category!: string;
  private _discount!: number;
  private _active!: boolean;

  constructor(data: ICouponData) {
    Object.assign(this, data);
  }

  get idProduct(): string {
    return this._idProduct;
  }

  set idProduct(value: string) {
    this._idProduct = value;
  }

  get img(): string {
    return this._img;
  }

  set img(value: string) {
    this._img = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get category(): string {
    return this._category;
  }

  set category(value: string) {
    this._category = value;
  }

  get discount(): number {
    return this._discount;
  }

  set discount(value: number) {
    this._discount = value;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

  isEqual(coupon: Coupon): boolean {
    return coupon._idProduct === this._idProduct;
  }

  isValid(): boolean {
    return !!(this._idProduct && this._name && this._discount && this._category);
  }

  toCouponData() {
    return {
      idProduct: this._idProduct,
      img: this._img,
      name: this._name,
      category: this._category,
      discount: this._discount,
      active: this._active
    } as ICouponData;
  }
}