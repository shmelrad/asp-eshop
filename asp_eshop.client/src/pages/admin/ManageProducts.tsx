import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import ProductTable from "./components/ProductTable"
import ProductDialog from "./components/ProductDialog"
import { Product, ProductDto } from "@/types/product"
import { productsApi } from "@/api/products"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { Loader2 } from "lucide-react"
import { Category, categoryApi } from "@/api/category"

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll()
        setCategories(data)
      } catch (error) {
        toast.error("Failed to fetch categories")
        console.error(error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        if (!debouncedSearch || debouncedSearch.length >= 3) {
          const data = await productsApi.getAll(currentPage, 10, debouncedSearch)
          setProducts(data.items)
          setTotalPages(data.totalPages)
        }
      } catch (error) {
        toast.error("Failed to fetch products")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, debouncedSearch])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])
  
  const handleAddProduct = async (newProduct: ProductDto) => {
    try {
      const createdProduct = await productsApi.create(newProduct)
      console.log(createdProduct)
      setProducts(prevProducts => [...prevProducts, createdProduct])
      toast.success("Product added successfully")
    } catch (error) {
      toast.error("Failed to add product")
      console.error(error)
    }
  }

  const handleEditProduct = async (product: ProductDto) => {
    try {
      await productsApi.update(product.id, product)
      setProducts(products.map((p) => 
        p.id === product.id ? { ...p, ...product } : p
      ))
      toast.success("Product updated successfully")
    } catch (error) {
      toast.error("Failed to update product")
      console.error(error)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      await productsApi.deleteProduct(id)
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id))
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error("Failed to delete product")
      console.error(error)
    }
  }

  const handleCreateCategory = async (name: string) => {
    try {
      const newCategory = await categoryApi.create({ name })
      setCategories([...categories, newCategory])
      return newCategory
    } catch (error) {
      toast.error("Failed to create category")
      console.error(error)
      throw error
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Manage Products</h1>
              <ProductDialog 
                mode="add" 
                onSubmit={handleAddProduct} 
                categories={categories}
                onCreateCategory={handleCreateCategory}
              />
            </div>
            <div className="relative max-w-sm">
              <Input
                placeholder="Search products (min 3 characters)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search.length > 0 && search.length < 3 && (
                <p className="text-sm text-destructive mt-1">
                  Please enter at least 3 characters to search
                </p>
              )}
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground mt-8">No products found</p>
          ) : (
            <>
              <ProductTable
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                categories={categories}
                onCreateCategory={handleCreateCategory}
              />
              {totalPages > 1 && (
                <Pagination
                  className="mt-4"
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 