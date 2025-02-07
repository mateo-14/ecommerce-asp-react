'use client'

import { ChakraProvider, ChakraProviderProps } from '@chakra-ui/react'

export function Provider(props: ChakraProviderProps) {
  return <ChakraProvider {...props} />
}
