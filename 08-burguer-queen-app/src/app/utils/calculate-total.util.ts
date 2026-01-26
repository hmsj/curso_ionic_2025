import { IProduct } from '../models/product.model';

export function calculateTotalPrice(product: IProduct, quantity: number): number {
  let priceProduct = product.price;
  if(product.extras) {
    let priceProductWithExtras = 0;
    for(const extra of product.extras) {
      const selectedOption = extra.options.find(option => option.selected);
      priceProductWithExtras += selectedOption ? selectedOption.price : 0;
    }
    priceProduct += priceProductWithExtras;
  }
  const total = priceProduct * quantity;
  return +total.toFixed(2);
}