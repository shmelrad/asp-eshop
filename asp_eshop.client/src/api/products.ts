import { BaseApi } from './base'
import { Product } from '@/types/products'
  
export type CreateProductDto = Omit<Product, "id">

class ProductsApi extends BaseApi {
  constructor() {
    super('/api/product')
  }

  getAll() {
    return this.get<Product[]>('')
  }

  getById(id: number) {
    return this.get<Product>(`/${id}`)
  }

  create(product: CreateProductDto) {
    return this.post<Product>('', product, { auth: true })
  }

  update(id: number, product: Product) {
    return this.put<void>(`/${id}`, product, { auth: true })
  }

  deleteProduct(id: number) {
    return this.delete<void>(`/${id}`, { auth: true })
  }
}

export const productsApi = new ProductsApi()
