import { Box, Flex, type HTMLChakraProps } from '@chakra-ui/react'
import React from 'react'

export interface NavItemProps extends HTMLChakraProps<'div'> {
  active?: boolean
}

export const NavItem = React.forwardRef<HTMLElement, NavItemProps>(({children,...props}, ref) => {
  return (
    <Box
      display={'block'}
      padding={2}
      borderRadius={'md'}
      _hover={{ bg: 'bg.muted' }}
      fontSize={'sm'}
      color={props.active ? 'fg' : 'gray.400'}
      background={props.active ? 'bg.muted' : ''}
      fontWeight={props.active ? 'medium' : 'normal'}
      ref={ref}
      {...props}
    >
      <Flex gap={3} alignItems={'center'} as="span">
        {children}
      </Flex>
    </Box>
  )
})

NavItem.displayName = 'NavItem'
