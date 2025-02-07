import { Provider } from '@/components/ui/provider'
import { defaultSystem } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function createWrapper(queryClient: QueryClient = new QueryClient()) {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider value={defaultSystem}> {children} </Provider>
    </QueryClientProvider>
  )
}
