import { BaseApi } from './base'
import { Product, ProductDto } from '@/types/product'
  
export type CreateProductDto = Omit<ProductDto, "id">

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

  getAll(page = 1, pageSize = 9, search?: string, categoryId?: string, favoritesOnly = false) {
    return this.get<PagedResult<Product>>('', { 
      params: { 
        page: page.toString(), 
        pageSize: pageSize.toString(),
        search: search || '',
        categoryId: categoryId || '',
        favoritesOnly: favoritesOnly.toString()
      }
    })
  }

  getById(id: number) {
    return this.get<Product>(`/${id}`)
  }

  create(product: Omit<ProductDto, "id">) {
    return this.post<Product>('', product, { auth: true })
  }

  update(id: number, product: ProductDto) {
    return this.put<void>(`/${id}`, product, { auth: true })
  }

  deleteProduct(id: number) {
    return this.delete<void>(`/${id}`, { auth: true })
  }

  toggleFavorite(id: number) {
    return this.post<{ isFavorite: boolean }>(`/${id}/favorite`, {}, { auth: true })
  }

  getFavoriteIds() {
    return this.get<number[]>('/favorites/ids', { auth: true })
  }
}

export const productsApi = new ProductsApi()
