import { IProductoExtraOption } from './producto-extra-option.model';

export interface IProductExtra {
  name?: string;
  img: string;
  options: IProductoExtraOption[];
}