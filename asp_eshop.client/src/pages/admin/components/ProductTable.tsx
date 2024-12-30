import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Product, ProductDto } from "@/types/product"
import { Category } from "@/types/category"
import { useState } from "react"
import { Loader2 } from "lucide-react"

import ProductDialog from "./ProductDialog"

interface ProductTableProps {
  products: Product[]
  onEdit: (product: ProductDto) => Promise<void>
  onDelete: (id: number) => void
  categories: Category[]
  onCreateCategory: (name: string) => Promise<Category>
}

export default function ProductTable({ products, onEdit, onDelete, categories, onCreateCategory }: ProductTableProps) {
  const [deletingIds, setDeletingIds] = useState<number[]>([])

  const handleDelete = async (id: number) => {
    if (deletingIds.includes(id)) return
    
    setDeletingIds(prev => [...prev, id])
    try {
      await onDelete(id)
    } catch (error) {
      console.error('Failed to delete product:', error)
    } finally {
      setDeletingIds(prev => prev.filter(deleteId => deleteId !== id))
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="w-8 h-8">
                <img 
                  src={product.imageUrl} 
                  className="w-full h-full object-cover"
                />
              </div>
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category?.name}</TableCell>
            <TableCell>{product.description}</TableCell>
            <TableCell>${product.price.toFixed(2)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <ProductDialog 
                  mode="edit" 
                  product={product} 
                  productId={product.id} 
                  onSubmit={onEdit}
                  categories={categories}
                  onCreateCategory={onCreateCategory}
                />
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingIds.includes(product.id)}
                >
                  {deletingIds.includes(product.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 