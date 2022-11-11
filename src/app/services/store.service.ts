import { Injectable } from '@angular/core';
import { Product} from '../models/product.model'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private myShoppingCart: Product [] = [];
  private myCar = new BehaviorSubject<Product []>([]);

  myCart$ = this.myCar.asObservable();

  constructor() { }

  addProducto(product: Product){
    this.myShoppingCart.push(product);
    this.myCar.next(this.myShoppingCart);
  }

  getmyShoppingCart(){
    return this.myShoppingCart;
  }

  getTotal(){
    return this.myShoppingCart.reduce((sum,item)=> sum + item.price,0);
  }
}
