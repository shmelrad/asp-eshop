import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import ProductTable from "./components/ProductTable"
import ProductDialog from "./components/ProductDialog"
import { Product } from "@/types/products"
import { productsApi } from "@/api/products"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getAll(currentPage)
        setProducts(data.items)
        setTotalPages(data.totalPages)
      } catch (error) {
        toast.error("Failed to fetch products")
        console.error(error)
      }
    }

    fetchProducts()
  }, [currentPage])

  const handleAddProduct = async (newProduct: Omit<Product, "id">) => {
    try {
      const product = await productsApi.create(newProduct)
      setProducts([...products, product])
      toast.success("Product added successfully")
    } catch (error) {
      toast.error("Failed to add product")
      console.error(error)
    }
  }

  const handleEditProduct = async (product: Product) => {
    try {
      await productsApi.update(product.id, product)
      setProducts(products.map((p) => (p.id === product.id ? product : p)))
      toast.success("Product updated successfully")
    } catch (error) {
      toast.error("Failed to update product")
      console.error(error)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      await productsApi.deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error("Failed to delete product")
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Products</h1>
            <ProductDialog 
              mode="add" 
              onSubmit={handleAddProduct} 
            />
          </div>
          <ProductTable
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
          <Pagination
            className="mt-4"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  )
} 