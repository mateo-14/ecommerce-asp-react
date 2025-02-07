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
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText
} from '@/components/ui/select'
import { categoriesQueryOptions } from '@/queries/categoriesQueryOptions'
import { Category, createCategory } from '@/services/categoriesService'
import { createListCollection, Input, Spinner } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

interface FormValues {
  name: string
  categories: string[]
}

interface CreateCategoryData {
  name: string
  parentId?: number
}

interface CreateCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (category: Category) => void
}

function CreateCategoryModal({ open, onOpenChange, onCreate }: CreateCategoryModalProps) {
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
      categories: []
    }
  })

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryData) => createCategory(data.name, data.parentId),
    onSuccess: (createdCategory) => {
      onCreate(createdCategory)
    }
  })

  const onSubmit = async (data: FormValues) => {
    if (data.categories.length > 0) {
      await createCategoryMutation.mutateAsync({
        name: data.name,
        parentId: Number(data.categories[0])
      })
    } else {
      await createCategoryMutation.mutateAsync({
        name: data.name
      })
    }
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
          <DialogTitle>Create new category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <Field label="Category name" invalid={!!formState.errors.name} errorText={formState.errors.name?.message}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                disabled={formState?.isSubmitting}
                rules={{
                  required: {
                    message: 'This field is required',
                    value: true
                  }
                }}
                render={({ field }) => <Input {...field} maxLength={32} />}
              />
            </Field>
            <Field label="Parent category" disabled={isLoading} mt={6}>
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
              aria-label="Create category"
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

export { CreateCategoryModal }
