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
import { Product, ProductDto } from "@/types/product"
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
import { Category } from "@/types/category"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductDialogProps {
  mode: 'add' | 'edit'
  onSubmit: (product: ProductDto) => Promise<void>
  product?: Product
  productId?: number
  categories: Category[]
  onCreateCategory: (name: string) => Promise<Category>
}

export default function ProductDialog({ mode, onSubmit, product, productId, categories, onCreateCategory }: ProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      imageUrl: product?.imageUrl ?? "",
      categoryId: product?.categoryId ?? undefined,
    },
  })

  const handleSubmit = async (data: ProductFormSchema) => {
    try {
      setIsLoading(true)
      if (mode === "edit" && product && productId) {
        await onSubmit({ ...data, id: productId, description: data.description ?? "" } as ProductDto)
      } else {
        await onSubmit({ ...data, description: data.description ?? "" } as ProductDto)
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
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    form.setValue('categoryId', randomCategory.id)
  }

  const handleCreateCategory = async () => {
    try {
      const newCategory = await onCreateCategory(newCategoryName)
      setIsCreatingCategory(false)
      setNewCategoryName("")
      form.setValue("categoryId", newCategory.id)
    } catch (error) {
      console.error(error)
    }
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
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreatingCategory(true)}
                    >
                      New Category
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isCreatingCategory && (
              <div className="flex gap-2">
                <Input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button type="button" onClick={handleCreateCategory}>
                  Create
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreatingCategory(false)}>
                  Cancel
                </Button>
              </div>
            )}

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