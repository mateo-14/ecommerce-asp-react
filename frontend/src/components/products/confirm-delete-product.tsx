import { DialogRoot, Spinner } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

interface ConfirmDeleteProductProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoading: boolean
}

export function ConfirmDeleteProduct({ open, onOpenChange, onConfirm, isLoading }: ConfirmDeleteProductProps) {
  return (
    <DialogRoot
      lazyMount
      placement={'center'}
      motionPreset="slide-in-bottom"
      size={'xs'}
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      closeOnEscape={!isLoading}
      closeOnInteractOutside={!isLoading}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>Are you sure you want to delete this product? This action cannot be undone.</p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button colorPalette={'red'} onClick={onConfirm} disabled={isLoading} width={24} aria-label="Confirm delete">
            {isLoading ? <Spinner /> : 'Delete'}
          </Button>
        </DialogFooter>
        <DialogCloseTrigger disabled={isLoading} />
      </DialogContent>
    </DialogRoot>
  )
}
