import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Product } from "@/types/products"

import ProductDialog from "./ProductDialog"

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => Promise<void>
  onDelete: (id: number) => void
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.description}</TableCell>
            <TableCell>${product.price.toFixed(2)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <ProductDialog mode="edit" product={product} productId={product.id} onSubmit={onEdit} />
                <Button
                  variant="destructive"
                  onClick={() => onDelete(product.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 