import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Product } from "@/types/products"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { productSchema, type ProductFormSchema } from "@/types/productSchema"
import { Wand2, Loader2 } from "lucide-react"
import { faker } from '@faker-js/faker'

interface ProductDialogProps {
  mode: 'add' | 'edit'
  onSubmit: (product: Product) => Promise<void>
  product?: Product
  productId?: number
}

export default function ProductDialog({ mode, onSubmit, product, productId }: ProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      imageUrl: product?.imageUrl ?? "",
    },
  })

  const handleSubmit = async (data: ProductFormSchema) => {
    try {
      setIsLoading(true)
      if (mode === "edit" && product && productId) {
        await onSubmit({ ...data, id: productId, description: data.description ?? "" })
      } else {
        await onSubmit({ ...data, id: 0, description: data.description ?? "" })
      }
      setOpen(false)
      form.reset(mode === 'edit' ? data : undefined)
    } finally {
      setIsLoading(false)
    }
  }

  const fillWithFakeData = () => {
    form.setValue('name', faker.commerce.productName())
    form.setValue('description', faker.commerce.productDescription())
    form.setValue('price', parseFloat(faker.commerce.price()))
    form.setValue('imageUrl', faker.image.urlLoremFlickr())
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={mode === 'edit' ? "outline" : "default"}>
          {mode === 'edit' ? 'Edit' : 'Add Product'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-4 items-center">
            {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
            {mode === 'add' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillWithFakeData}
                className="flex gap-2 items-center"
              >
                <Wand2 className="h-4 w-4" />
                Fill with random data
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Product description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'edit' ? 'Saving...' : 'Adding...'}
                </>
              ) : (
                mode === 'edit' ? 'Save Changes' : 'Add Product'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 