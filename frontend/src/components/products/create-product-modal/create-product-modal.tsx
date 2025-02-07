import { Button } from '@/components/ui/button'
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle
} from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from '@/components/ui/file-upload'
import { NumberInputField, NumberInputRoot } from '@/components/ui/number-input'
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText
} from '@/components/ui/select'
import { categoriesQueryOptions } from '@/queries/categoriesQueryOptions'
import { createProduct, Product } from '@/services/productsService'
import { createListCollection, Input, Spinner, Textarea } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }),
  price: z.number({
    invalid_type_error: 'Price is required'
  }),
  stock: z.number({
    invalid_type_error: 'Stock is required'
  }),
  categories: z.array(z.string()),
  description: z.string(),
  images: z.array(z.instanceof(File)).max(4, { message: 'Max 4 images allowed' })
})

interface CreateProductData {
  name: string
  price: number
  stock: number
  categoryId?: number
  description: string
  images: File[]
}

interface CreateProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (product: Product) => void
}

type FormValues = z.infer<typeof schema>
export function CreateProductModal({ open, onOpenChange, onCreate }: CreateProductModalProps) {
  // Get categories to populate the select
  const { isLoading, data } = useQuery({
    ...categoriesQueryOptions(1, 0),
    enabled: open
  })

  const categories = useMemo(
    () =>
      createListCollection({
        items:
          data?.data.map((c) => ({
            label: c.name,
            value: c.id.toString()
          })) ?? []
      }),
    [data]
  )

  const { control, handleSubmit, formState, reset } = useForm<FormValues>({
    defaultValues: {
      name: '',
      price: 0,
      stock: 0,
      categories: [],
      images: [],
      description: ''
    },
    resolver: zodResolver(schema)
  })
  const { errors } = formState

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const createProductMutation = useMutation({
    mutationFn: (data: CreateProductData) =>
      createProduct(data.name, data.price, data.stock, data.description, data.images, data.categoryId),
    onSuccess: (createdProduct) => {
      onCreate(createdProduct)
    }
  })

  const onSubmit = async (data: FormValues) => {
    await createProductMutation.mutateAsync({
      name: data.name,
      price: data.price,
      stock: data.stock,
      categoryId: Number(data.categories[0]),
      description: data.description,
      images: data.images
    })
  }

  return (
    <DialogRoot
      size={'lg'}
      placement={'center'}
      motionPreset="slide-in-bottom"
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogBody>
            <Field label="Product name" invalid={!!errors.name} errorText={errors.name?.message}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                disabled={formState?.isSubmitting}
                render={({ field }) => <Input {...field} maxLength={120} />}
              />
            </Field>
            <Field label="Price" invalid={!!errors.price} errorText={errors.price?.message}>
              <Controller
                name="price"
                control={control}
                defaultValue={0}
                disabled={formState?.isSubmitting}
                render={({ field }) => (
                  <NumberInputRoot
                    onValueChange={(e) => field.onChange(e.value)}
                    onBlur={field.onBlur}
                    value={field.value.toString()}
                    w={'full'}
                    min={0}
                    max={10000000}
                  >
                    <NumberInputField />
                  </NumberInputRoot>
                )}
              />
            </Field>
            <Field label="Stock" invalid={!!errors.stock} errorText={errors.stock?.message}>
              <Controller
                name="stock"
                control={control}
                defaultValue={0}
                disabled={formState?.isSubmitting}
                render={({ field }) => (
                  <NumberInputRoot
                    onValueChange={(e) => field.onChange(e.value)}
                    onBlur={field.onBlur}
                    value={field.value.toString()}
                    w={'full'}
                    min={0}
                    max={10000000}
                  >
                    <NumberInputField />
                  </NumberInputRoot>
                )}
              />
            </Field>
            <Field label="Category" disabled={isLoading} mt={6}>
              <Controller
                name="categories"
                control={control}
                defaultValue={[]}
                disabled={formState?.isSubmitting}
                render={({ field }) => (
                  <SelectRoot
                    collection={categories}
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    disabled={field.disabled}
                    onBlur={field.onBlur}
                  >
                    <SelectLabel />
                    <SelectTrigger>
                      <SelectValueText />
                    </SelectTrigger>
                    <SelectContent zIndex={1404}>
                      {categories.items.map((category) => (
                        <SelectItem key={category.value} item={category}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                )}
              />
            </Field>

            <Field label="Description" mt={6}>
              <Controller
                control={control}
                name="description"
                disabled={formState?.isSubmitting}
                render={({ field }) => <Textarea {...field} placeholder="Description" maxHeight={'120px'} autoresize maxLength={512} />}
              />
            </Field>

            <Field label="Images (Max: 4)" mt={6} invalid={!!errors.images} errorText={errors.images?.message}>
              <Controller
                control={control}
                name="images"
                disabled={formState?.isSubmitting}
                render={({ field }) => (
                  <FileUploadRoot
                    alignItems="stretch"
                    maxFiles={4}
                    maxFileSize={5000000}
                    onFileChange={(e) => field.onChange(e.acceptedFiles)}
                    accept={['.png', '.jpg', '.webp']}
                  >
                    <FileUploadDropzone
                      label="Drag and drop here to upload"
                      description=".png, .jpg, .webp up to 5MB"
                    />
                    <FileUploadList clearable />
                  </FileUploadRoot>
                )}
              />
            </Field>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline" disabled={formState?.isSubmitting}>
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              colorPalette={'purple'}
              type="submit"
              disabled={formState?.isSubmitting}
              width={24}
              aria-label="Create product"
            >
              {formState?.isSubmitting ? <Spinner /> : 'Create'}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
