import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { productsApi } from "@/api/products"
import { Product } from "@/types/products"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { Loader2 } from "lucide-react"

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        if (!debouncedSearch || debouncedSearch.length >= 3) {
          const data = await productsApi.getAll(currentPage, 9, debouncedSearch)
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

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="relative max-w-sm">
          <Input
            placeholder="Search products (min 3 characters)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {search.length > 0 && search.length < 3 && (
            <p className="text-sm text-destructive mt-1">
              Please enter at least 3 characters to search
            </p>
          )}
        </div>
      </div>
      {products.length === 0 ? (
        <p className="text-center text-muted-foreground mt-8">No products found</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
    </div>
  )
} 