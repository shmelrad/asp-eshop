import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { productsApi } from "@/api/products"
import { Product } from "@/types/products"
import { toast } from "sonner"

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getAll()
        setProducts(data)
      } catch (error) {
        toast.error("Failed to fetch products")
        console.error(error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  )
} 