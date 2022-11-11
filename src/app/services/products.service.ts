import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http'
import { Product, CreateProductDTO, UpdateProductDTO } from './../models/product.model'
import { retry, catchError, map } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';
import { environment } from './../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private url = `${environment.API_URL}/api`;
  constructor(
    private http: HttpClient
  ) { }

  getByCategory(categoryId: string, limit?: number, offset?: number){
    let params = new HttpParams();
    if (limit && offset != null) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(`${this.url}/categories/${categoryId}/products`, { params })
  }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(`${this.url}/products`, { params })
    .pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    );
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.url}/products/${id}`).pipe(catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Conflict) {
        return throwError('Ups algo esta fallando en el server');
      }
      if (error.status === HttpStatusCode.NotFound) {
        return throwError('El producto no existe');
      }
      if (error.status === HttpStatusCode.Unauthorized) {
        return throwError('No tienes permisos');
      }
      return throwError('Ups algo salio mal');
    })
    )
  }

  getProductByPages(limit: number, offset: number) {
    return this.http.get<Product[]>(`${this.url}/products`, {
      params: { limit, offset }
    }).pipe(retry(3),
    map(products => products.map(item => {
      return {
        ...item,
        taxes: .19 * item.price
      }
    })));
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO){
    return zip(
      this.getProduct(id),
      this.update(id, dto)
    )
  }

  create(data: CreateProductDTO) {
    return this.http.post<Product>(`${this.url}/products`, data);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.url}/products/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.url}/products/${id}`);
  }
}
