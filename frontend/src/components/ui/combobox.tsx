import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { useState } from 'react'
import { Button } from './button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command'
import clsx from 'clsx'

interface Item {
  id: number
  name: string
}
interface ComboboxProps<T extends Item> {
  value: T | null
  onChange: (value: T) => void
  items: T[]
  placeholder?: string
}

export default function Combobox<T extends Item>({ value, onChange, items, placeholder = '' }: ComboboxProps<T>) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? value.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => {
                    onChange(item)
                    setOpen(false)
                  }}
                >
                  <Check className={clsx('mr-2 h-4 w-4', value?.id === item.id ? 'opacity-100' : 'opacity-0')} />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
