import { BaseApi } from './base'
import { Product } from '@/types/products'
  
export type CreateProductDto = Omit<Product, "id">

interface PagedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

class ProductsApi extends BaseApi {
  constructor() {
    super('/api/product')
  }

  getAll(page = 1, pageSize = 9, search?: string) {
    return this.get<PagedResult<Product>>('', { 
      params: { 
        page: page.toString(), 
        pageSize: pageSize.toString(),
        search: search || ''
      }
    })
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
