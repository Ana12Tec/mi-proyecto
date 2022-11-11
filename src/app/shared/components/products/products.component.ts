/* eslint-disable @angular-eslint/no-output-on-prefix */
import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Product, CreateProductDTO, UpdateProductDTO } from '../../../models/product.model'
import { StoreService } from '../../../services/store.service'
import { ProductsService } from '../../../services/products.service'
import { switchMap } from 'rxjs/operators'
import  Swal  from 'sweetalert2'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent {

  myShoppingCart: Product[] = [];
  @Input() product: Product[] = [];
  @Input()
  set productId(id: string | null){
    if(id){
      this.onShowDetail(id);
    }
  }
  @Output() onLoadMore : EventEmitter<string> = new EventEmitter<string>();

  total = 0;
  showProductDetail = false;
  today = new Date();
  date = new Date(2021, 1, 21);
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';


  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getmyShoppingCart();
  }

  productChosen: Product = {
    id: '',
    title: '',
    images: [],
    price: 0,
    category: {
      id: '',
      name: '',
    },
    description: ''
  };

  // ngOnInit(): void {
  //   this.productsService.getProductByPages(10, 0)
  //   .subscribe(data => {
  //     console.log(data);
  //     this.product = data;
  //     this.offset += this.limit;
  //   });
  // }

  onAddToShoppingCart(product: Product) {
    console.log(product);
    this.storeService.addProducto(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.statusDetail = 'loading';
    if(!this.showProductDetail){
      this.showProductDetail = true;
    }
    this.productsService.getProduct(id)
    .subscribe(data => {
      this.productChosen = data;
      this.statusDetail = 'success';
    }, errorMessage => {
      this.statusDetail = 'error';
      Swal.fire({
        title : errorMessage,
        text: errorMessage,
        icon: 'error',
        confirmButtonText : 'Cool'
      })
    })
  }

  readAndUpdate(id : string){
    this.productsService.getProduct(id)
    .pipe(
      switchMap((product) => this.productsService.update(product.id, {title : 'change'}))
    )
    .subscribe(data => {
        console.log(data);
    });
    this.productsService.fetchReadAndUpdate(id, {title : 'change'})
    .subscribe(response => {
      const product = response[0];
      const update = response[1];
    });
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'Nuevo producto',
      description: 'bla bla bla',
      images: [''],
      price: 1000,
      categoryId: 1,
    }
    this.productsService.create(product)
    .subscribe(data => {
      console.log('created', data);
      this.product.unshift(data);
    });
  }

  updateProduct() {
    const changes: UpdateProductDTO = {
      title: 'Cambio titulo',
    }
    const id = this.productChosen.id;
    this.productsService.update(id, changes)
      .subscribe(data => {
        console.log('update', data);
        const productIndex = this.product.findIndex(item => item.id === this.productChosen.id);
        this.product[productIndex] = data;
        this.productChosen = data;
      });
  }

  deleteProduct() {
    const id = this.productChosen.id;
    this.productsService.delete(id)
    .subscribe(() => {
      console.log('delete', id);
      const productIndex = this.product.findIndex(item => item.id === this.productChosen.id);
      this.product.splice(productIndex, 1);
      this.showProductDetail = false;
    })
  }

  loadMore() {
    this.onLoadMore.emit();
  }
}
