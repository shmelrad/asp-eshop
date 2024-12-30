import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Product } from "@/types/product"
import { productsApi } from "@/api/products"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Heart } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const { token } = useAuthStore()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return
        const data = await productsApi.getById(parseInt(id))
        setProduct(data)
        
        if (token) {
          const favoriteIds = await productsApi.getFavoriteIds()
          setIsFavorite(favoriteIds.includes(data.id))
        }
      } catch (error) {
        toast.error("Failed to fetch product")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id, token])

  const toggleFavorite = async () => {
    if (!token) {
      toast.error("Please login to add favorites")
      return
    }

    if (!product) return

    try {
      const { isFavorite: newIsFavorite } = await productsApi.toggleFavorite(product.id)
      setIsFavorite(newIsFavorite)
      toast.success(newIsFavorite ? "Added to favorites" : "Removed from favorites")
    } catch (error) {
      toast.error("Failed to update favorite")
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!product) {
    return <div className="text-center">Product not found</div>
  }

  return (
    <div className="container mx-auto py-10">
          <Link key={product.id} to={`/products/${product.id}`}></Link>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full rounded-lg object-cover aspect-square"
              />
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md"
              >
                <Heart className={`h-6 w-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-gray-600">{product.category?.name}</p>
              <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 