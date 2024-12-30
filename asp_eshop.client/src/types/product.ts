import { Category } from "./category"

export interface Product {
    id: number
    name: string
    description?: string
    price: number
    imageUrl?: string
    categoryId: number
    category: Category
}

export type ProductDto = Omit<Product, 'category'> 