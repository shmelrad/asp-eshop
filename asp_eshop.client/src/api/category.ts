import { BaseApi } from './base'

export interface Category {
  id: number
  name: string
  description?: string
}

class CategoryApi extends BaseApi {
  constructor() {
    super('/api/category')
  }

  getAll() {
    return this.get<Category[]>('')
  }

  create(category: Omit<Category, "id">) {
    return this.post<Category>('', category, { auth: true })
  }
}

export const categoryApi = new CategoryApi()