import { Category } from '@/services/categoriesService'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import Combobox from './ui/combobox'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

export interface CategoryFormValues {
  name: string
  parent: Category | null
}

interface CategoryFormProps {
  categories: Category[]
  onSubmit: (data: CategoryFormValues) => void
  categoryToEdit?: Category
}

export default function CategoryForm({ categories, onSubmit, categoryToEdit }: CategoryFormProps) {
  // Remove the category being edited from the list of categories
  categories = categoryToEdit ? categories.filter((category) => category.id !== categoryToEdit.id) : categories
  categories = [{ id: 0, name: 'No parent', parentId: null, parentName: null }, ...categories]
  const form = useForm<CategoryFormValues>({
    defaultValues: {
      name: categoryToEdit?.name ?? '',
      parent: categoryToEdit ? categories.find((category) => category.id === categoryToEdit.parentId) : null
    }
  })
  const { control, handleSubmit, formState } = form

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-w-5xl">
        <div className="grid grid-cols-2 gap-6 mt-6">
          <FormField
            rules={{ required: 'Category name is required' }}
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="parent"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Category name</FormLabel>
                  <FormControl>
                    <Combobox
                      items={categories}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select parent category"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>

        <Button type="submit" className="mt-8 self-start" disabled={formState.isSubmitting}>
          {formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {categoryToEdit ? 'Update' : 'Create'}
        </Button>
      </form>
    </Form>
  )
}
