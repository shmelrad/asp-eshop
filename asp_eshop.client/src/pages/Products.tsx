import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { productsApi } from "@/api/products"
import { Product } from "@/types/product"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categoryApi } from "@/api/category"
import { Category } from "@/types/category"
import { useAuthStore } from "@/stores/authStore"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart } from "lucide-react"
import { Link } from "react-router-dom"

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const debouncedSearch = useDebounce(search, 300)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [categories, setCategories] = useState<Category[]>([])
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const { token } = useAuthStore()

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
          const data = await productsApi.getAll(currentPage, 9, debouncedSearch, selectedCategory === "all" ? "" : selectedCategory)
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
  }, [currentPage, debouncedSearch, selectedCategory])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    const fetchFavoriteIds = async () => {
      if (!token) return
      try {
        const ids = await productsApi.getFavoriteIds()
        setFavoriteIds(ids)
      } catch (error) {
        console.error('Failed to fetch favorite ids:', error)
      }
    }
    fetchFavoriteIds()
  }, [token])

  const toggleFavorite = async (productId: number) => {
    if (!token) {
      toast.error("Please login to add favorites")
      return
    }

    try {
      const { isFavorite } = await productsApi.toggleFavorite(productId)
      setFavoriteIds(prev =>
        isFavorite
          ? [...prev, productId]
          : prev.filter(id => id !== productId)
      )
      toast.success(isFavorite ? "Added to favorites" : "Removed from favorites")
    } catch (error) {
      toast.error("Failed to update favorite")
      console.error(error)
    }
  }

  const filteredProducts = showFavoritesOnly
    ? products.filter(product => favoriteIds.includes(product.id))
    : products

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-4 items-end">
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
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={showFavoritesOnly}
              onCheckedChange={(checked) => setShowFavoritesOnly(checked as boolean)}
            />
            Show favorites only
          </label>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground mt-8">No products found</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="relative">
                      <Link to={`/products/${product.id}`}>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      </Link>
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
                      >
                        {favoriteIds.includes(product.id) ? (
                          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                        ) : (
                          <Heart className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    <p className="text-gray-600 mt-2">{product.category?.name}</p>
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
    </div>
  )
} 